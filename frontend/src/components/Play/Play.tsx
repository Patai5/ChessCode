/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import React from "react";
import { useParams } from "react-router-dom";
import { getWSUri } from "utils/websockets";
import Chessboard, { RefType } from "./ChessBoard/ChessBoard";
import { Move, MoveInfo, MoveName } from "./ChessBoard/ChessLogic/board";
import { Color } from "./ChessBoard/ChessLogic/pieces";
import Connecting from "./Connecting/Connecting";

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

type Props = { color?: Color };
export default function Play(props: Props) {
    const ws = React.useRef<WebSocket | null>(null);
    const [connectingState, setConnectingState] = React.useState(ConnectingState.Connecting);
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

    const updateReceivedMove = (moveName: MoveName) => {
        if (!chessboardRef.current) return;

        const { move, promotionPiece } = Move.fromName(moveName);
        chessboardRef.current.clientMakeMove(move, promotionPiece);
    };

    const broadcastMove = (move: MoveInfo) => {
        sendMessage(JSON.stringify({ type: "move", move: move.toName() }));
    };

    const handleOnMessage = (msg: MessageEvent) => {
        const data = JSON.parse(msg.data);
        switch (data.type) {
            case "join":
                setConnectingState(ConnectingState.Connected);
                break;
            case "move":
                updateReceivedMove(data.move);
                break;
            case "error":
                ErrorQueueClass.addError({ errorMessage: data.message });
                setConnectingState(ConnectingState.Error);
                break;
            default:
                ErrorQueueClass.addError({ errorMessage: `Unknown message type received: ${data.type}` });
        }
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

    React.useEffect(() => {}, [ws.current]);
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

    const { color = Color.White } = props;

    return (
        <div css={playCss}>
            {connectingState === ConnectingState.Connecting && <Connecting />}
            {connectingState === ConnectingState.Connected && (
                <Chessboard color={color} broadcastMove={broadcastMove} ref={chessboardRef} />
            )}
        </div>
    );
}
