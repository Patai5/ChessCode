/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { PlayersProps as PlayersAPI } from "components/shared/Chess/ActionBar/ActionBar";
import Chess, { PlayersProps } from "components/shared/Chess/Chess";
import { RefType } from "components/shared/Chess/ChessBoard/ChessBoard";
import { Move, MoveInfo, MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { Color } from "components/shared/Chess/ChessBoard/ChessLogic/pieces";
import { GameResult } from "components/shared/Chess/ResultsDisplay/ResultsDisplay";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import UserMenu from "components/shared/UserMenu/UserMenu";
import { AppContext } from "hooks/appContext";
import React from "react";
import { useParams } from "react-router-dom";
import { validateId } from "utils/chess";
import { getWSUri } from "utils/websockets";
import Connecting from "./Connecting/Connecting";

const ColorName = { white: Color.White, black: Color.Black };
interface JoinAPIResponse {
    players: PlayersProps;
    moves: MoveName[];
    offer_draw: boolean;
    game_started: boolean;
}

interface MoveAPIResponse {
    move: MoveName;
    players: PlayersAPI;
}

interface GameStartedAPIResponse {
    players: PlayersAPI;
}

type GameResultAPIResponse = GameResult

const playCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const enum ConnectingState {
    Connecting,
    Connected,
    Error,
}

export default function Play() {
    const [connectingState, setConnectingState] = React.useState(ConnectingState.Connecting);
    const [color, setColor] = React.useState<Color>(Color.White);
    const [gameResult, setGameResult] = React.useState<GameResult | null>(null);
    const [highlightDrawButton, setHighlightDrawButton] = React.useState(false);
    const [gameStarted, setGameStarted] = React.useState(true);
    const [players, setPlayers] = React.useState<PlayersProps | null>(null);
    const ws = React.useRef<WebSocket | null>(null);
    const chessboardRef = React.useRef<RefType>(null);
    const appContext = React.useContext(AppContext);
    const clientUsername = React.useRef(appContext.username);
    const { id } = useParams();

    React.useEffect(() => {
        clientUsername.current = appContext.username;
    }, [appContext.username]);

    const setError = (error: string) => {
        ErrorQueueClass.addError({ errorMessage: error });
        setConnectingState(ConnectingState.Error);
    };

    const handleGameIdValidation = (): boolean => {
        const isValidId = validateId(id);
        if (isValidId !== true) {
            setError(isValidId);
            return false;
        }
        return true;
    };

    const broadcastMove = (move: MoveInfo) => {
        setHighlightDrawButton(false);
        sendMessage(JSON.stringify({ type: "move", move: move.toName() }));
    };

    const handleOnMessage = (msg: MessageEvent) => {
        const data = JSON.parse(msg.data);
        switch (data.type) {
            case "join":
                handleJoined(data);
                break;
            case "game_started":
                handleGameStarted(data);
                break;
            case "move":
                handleMove(data);
                break;
            case "game_result":
                handleGameResult(data);
                break;
            case "offer_draw":
                handleReceivedDrawOffer();
                break;
            case "error":
                ErrorQueueClass.addError({ errorMessage: data.message });
                setConnectingState(ConnectingState.Error);
                break;
            default:
                ErrorQueueClass.addError({ errorMessage: `Unknown message type received: ${data.type}` });
        }
    };

    const handleResign = () => {
        sendMessage(JSON.stringify({ type: "resign" }));
    };

    const handleOfferDraw = () => {
        sendMessage(JSON.stringify({ type: "offer_draw" }));
    };

    const handleReceivedDrawOffer = () => {
        setHighlightDrawButton(true);
    };

    const updatePlayersFromAPI = (playersAPI: PlayersAPI) => {
        const playersProps = {} as PlayersProps;
        for (const [color, player] of Object.entries(playersAPI)) {
            playersProps[ColorName[color as "white" | "black"]] = {
                ...player,
            };
        }
        setPlayers(playersProps);
    };

    const updateMove = (moveName: MoveName) => {
        if (!chessboardRef.current) return;
        const { move, promotionPiece } = Move.fromName(moveName);
        chessboardRef.current.clientMakeMove(move, promotionPiece);
    };

    const handleMove = (data: MoveAPIResponse) => {
        setHighlightDrawButton(false);
        updatePlayersFromAPI(data.players);
        updateMove(data.move);
    };

    const handleGameResult = (data: GameResultAPIResponse) => {
        setHighlightDrawButton(false);
        setGameResult({
            winner: data.winner,
            termination: data.termination,
        });
    };

    const handleJoined = (data: JoinAPIResponse) => {
        if (!clientUsername.current) return setError("Username is not set");

        for (const [color, player] of Object.entries(data.players)) {
            if (player.username === clientUsername.current) {
                setColor(ColorName[color as "white" | "black"]);
            }
        }
        updatePlayersFromAPI(data.players);

        for (const move of data.moves) {
            updateMove(move);
        }

        setGameStarted(data.game_started);
        setHighlightDrawButton(data.offer_draw);

        setConnectingState(ConnectingState.Connected);
    };

    const joinGame = () => {
        sendMessage(
            JSON.stringify({
                type: "join",
                game_id: id,
            })
        );
    };

    const handleGameStarted = (data: GameStartedAPIResponse) => {
        setGameStarted(true);
        updatePlayersFromAPI(data.players);
    };

    const sendMessage = (msg: string) => {
        if (!ws.current || ws.current.readyState !== ws.current.OPEN) {
            setError("Not connected to server");
            return;
        }
        ws.current.send(msg);
    };

    React.useEffect(() => {
        if (!handleGameIdValidation()) return;
        if (ws.current) return;

        const createWs = new WebSocket(getWSUri() + "/api/play/" + id);

        createWs.onopen = () => {
            ws.current = createWs;
            joinGame();
        };
        createWs.onmessage = (e) => {
            handleOnMessage(e);
        };
        createWs.onclose = (ev) => {
            if (ev.code === 1000) return; // Normal closure
            setError("Connection closed - CODE: " + ev.code);
        };
        createWs.onerror = () => {
            setError("Error connecting to server");
        };

        return () => {
            if (createWs.readyState === createWs.OPEN) createWs.close();
        };
    }, []);

    const chessProps = {
        color: color,
        players: players,
        gameStarted: gameStarted,
        gameResult: gameResult,
        broadcastMove: broadcastMove,
        actions: {
            playActions: {
                highlightDraw: highlightDrawButton,
                resign: handleResign,
                offerDraw: handleOfferDraw,
            },
        },
        isReplay: false,
        ref: chessboardRef,
    };

    return (
        <>
            <UserMenu />
            <div css={playCss}>
                {connectingState === ConnectingState.Connecting && <Connecting />}
                {connectingState === ConnectingState.Connected && <Chess {...chessProps} />}
            </div>
        </>
    );
}
