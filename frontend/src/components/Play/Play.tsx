/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import UserMenu from "components/shared/UserMenu/UserMenu";
import React from "react";
import { useParams } from "react-router-dom";
import { getWSUri } from "utils/websockets";
import { PlayerProps as PlayerAPI } from "./Chess/ActionBar/ActionBar";
import Chess, { PlayersProps } from "./Chess/Chess";
import { RefType } from "./Chess/ChessBoard/ChessBoard";
import { Move, MoveInfo, MoveName } from "./Chess/ChessBoard/ChessLogic/board";
import { Color } from "./Chess/ChessBoard/ChessLogic/pieces";
import { GameResult } from "./Chess/ResultsDisplay/ResultsDisplay";
import Connecting from "./Connecting/Connecting";

const ColorName = { white: Color.White, black: Color.Black };
type PlayersAPI = { [color in keyof typeof ColorName]: PlayerAPI };
interface JoinAPIResponse {
    players: PlayersAPI;
    moves: MoveName[];
    offer_draw: boolean;
}

interface MoveAPIResponse {
    move: MoveName;
    players: PlayersAPI;
}

interface GameResultAPIResponse extends GameResult {}

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

type Props = {};
export default function Play(props: Props) {
    const [connectingState, setConnectingState] = React.useState(ConnectingState.Connecting);
    const [color, setColor] = React.useState<Color>(Color.White);
    const [gameResult, setGameResult] = React.useState<GameResult | null>(null);
    const [highlightDrawButton, setHighlightDrawButton] = React.useState(false);
    const players = React.useRef<PlayersProps | null>(null);
    const ws = React.useRef<WebSocket | null>(null);
    const chessboardRef = React.useRef<RefType>(null);
    const { id } = useParams();

    const setError = (error: string) => {
        ErrorQueueClass.addError({ errorMessage: error });
        setConnectingState(ConnectingState.Error);
    };

    const validateId = () => {
        if (!id) {
            setError("No game ID provided");
            return false;
        }
        if (!id.match(/^[a-zA-Z0-9]{8}$/)) {
            setError("Invalid game ID");
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
        players.current = playersProps;
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
        const clientUsername = localStorage.getItem("username");
        if (!clientUsername) return setError("Username is not set");

        for (const [color, player] of Object.entries(data.players)) {
            if (player.username === clientUsername) {
                setColor(ColorName[color as "white" | "black"]);
            }
        }
        updatePlayersFromAPI(data.players);

        for (const move of data.moves) {
            updateMove(move);
        }

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

    const sendMessage = (msg: string) => {
        if (!ws.current) return;
        ws.current.send(msg);
    };

    React.useEffect(() => {
        if (!validateId()) return;
        const createWs = new WebSocket(getWSUri() + "/api/play/" + id);

        createWs.onopen = () => {
            ws.current = createWs;
            joinGame();
        };
        createWs.onclose = (ev) => {
            if (ev.code === 1000) return; // Normal closure
            setError("Connection closed - CODE: " + ev.code);
        };
        createWs.onerror = (err) => {
            setError("Connection error");
        };
        createWs.onmessage = (msg) => {
            handleOnMessage(msg);
        };
    }, []);

    return (
        <>
            <UserMenu />
            <div css={playCss}>
                {connectingState === ConnectingState.Connecting && <Connecting />}
                {connectingState === ConnectingState.Connected && players.current && (
                    <Chess
                        color={color}
                        broadcastMove={broadcastMove}
                        players={players.current}
                        gameResult={gameResult}
                        actions={{
                            highlightDraw: highlightDrawButton,
                            resign: handleResign,
                            offerDraw: handleOfferDraw,
                        }}
                        ref={chessboardRef}
                    />
                )}
            </div>
        </>
    );
}
