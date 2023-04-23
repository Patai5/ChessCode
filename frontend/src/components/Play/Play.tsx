/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import React from "react";
import { useParams } from "react-router-dom";
import { getWSUri } from "utils/websockets";
import { RefType } from "./Chess/ChessBoard/ChessBoard";
import { Move, MoveInfo, MoveName } from "./Chess/ChessBoard/ChessLogic/board";
import { Color } from "./Chess/ChessBoard/ChessLogic/pieces";
import { TimeMs } from "./Chess/ChessTimer/ChessTimer";
import { Timers } from "./Chess/Chess";
import Connecting from "./Connecting/Connecting";
import Chess from "./Chess/Chess";
import { GameResult } from "./Chess/ResultsDisplay/ResultsDisplay";

const ColorName = { white: Color.White, black: Color.Black };
type Player = { color: keyof typeof ColorName; time: TimeMs };
type Players = { [username: string]: Player };
interface JoinAPIResponse {
    players: Players;
    moves: MoveName[];
}

interface MoveAPIResponse {
    move: MoveName;
    players: Players;
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
    const timers = React.useRef<Timers>({ white: 0, black: 0 });
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
            case "error":
                ErrorQueueClass.addError({ errorMessage: data.message });
                setConnectingState(ConnectingState.Error);
                break;
            default:
                ErrorQueueClass.addError({ errorMessage: `Unknown message type received: ${data.type}` });
        }
    };

    const updateTimers = (players: Players) => {
        for (const player of Object.values(players)) {
            timers.current[player.color] = Math.floor(player.time / 100) * 100; // Convert to 1/10 of a second
        }
    };

    const updateMove = (moveName: MoveName) => {
        if (!chessboardRef.current) return;
        const { move, promotionPiece } = Move.fromName(moveName);
        chessboardRef.current.clientMakeMove(move, promotionPiece);
    };

    const handleMove = (data: MoveAPIResponse) => {
        updateTimers(data.players);
        updateMove(data.move);
    };

    const handleGameResult = (data: GameResultAPIResponse) => {
        setGameResult({
            winner: data.winner,
            termination: data.termination,
        });
    };

    const handleJoined = (data: JoinAPIResponse) => {
        const clientUsername = localStorage.getItem("username");
        if (!clientUsername) return setError("Username is not set");

        const color = data.players[clientUsername].color;
        setColor(ColorName[color]);
        updateTimers(data.players);

        for (const move of data.moves) {
            updateMove(move);
        }
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
        createWs.onclose = () => {
            setError("Connection closed");
        };
        createWs.onerror = (err) => {
            setError("Connection error");
        };
        createWs.onmessage = (msg) => {
            handleOnMessage(msg);
        };
    }, []);

    return (
        <div css={playCss}>
            {connectingState === ConnectingState.Connecting && <Connecting />}
            {connectingState === ConnectingState.Connected && (
                <Chess
                    color={color}
                    broadcastMove={broadcastMove}
                    timers={timers.current}
                    gameResult={gameResult}
                    ref={chessboardRef}
                />
            )}
        </div>
    );
}
