/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import Paper from "components/shared/Paper";
import React from "react";
import { WSErrorCodes, getWSUri } from "utils/websockets";
import PlayAgainstPicker, { playAgainstType } from "./PlayAgainstPicker/PlayAgainstPicker";
import Queuing, { QueueState } from "./Queuing/Queuing";
import TimeControlPicker from "./TimeControlPicker/TimeControlPicker";

const findGameCss = css`
    background: linear-gradient(#05586d, #520476);
    display: flex;
    width: 25em;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    padding: 1em;
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    border-radius: 15px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
const titleCss = css`
    font-family: "Lexend Deca", sans-serif;
    font-size: 2.15em;
    font-weight: 500;
    font-style: underline;
    text-decoration-line: underline;
    padding: 0;
    margin: 0;
`;
const mainPaperCss = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.9em;
`;

export type handleStartQueueingType = (queue: QueueState) => Promise<void>;

type Props = {};
export default function FindGame(props: Props) {
    const [queuing, setQueuing] = React.useState<QueueState | null>(null);
    const [showQueuing, setShowQueuing] = React.useState(false);
    const [playAgainst, setPlayAgainst] = React.useState<playAgainstType>("random");
    const [ws, setWebSocket] = React.useState<WebSocket | null>(null);

    const handleOnMessage = async (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
            case "game_found":
                if (!data.game_id) return;
                joinGame(data.game_id);
                break;
            case "error":
                // If for whatever reason a user is already in a queue, we won't show an error and instead remove him from the queue
                if (data.message === "User is already in queue") {
                    await stopQueuingAPI();
                    if (!queuing) return;
                    await startQueuingAPI(queuing);
                    return;
                }
                ErrorQueueClass.addError({ errorMessage: data.message });
                return handleStopQueuing();
            default:
                ErrorQueueClass.addError({ errorMessage: `Unknown message type received: ${data.type}` });
        }
    };

    React.useEffect(() => {
        // Configuring the websocket
        // TODO: Better error handling, websocket might not be created yet when already calling the api
        // Also when the socket gets closed we should create a new one
        const ws = new WebSocket(getWSUri() + "/api/play/queue");

        ws.onmessage = (e) => {
            handleOnMessage(e);
        };

        ws.onclose = (e) => {
            if (e.code in WSErrorCodes)
                ErrorQueueClass.addError({ errorMessage: WSErrorCodes[e.code as keyof typeof WSErrorCodes] });
            else ErrorQueueClass.addError({ errorMessage: "Your connection was unexpectedly closed" });
            handleStopQueuing();
        };

        ws.onerror = (e) => {
            ErrorQueueClass.addError({ errorMessage: "Error connecting to server" });
            handleStopQueuing();
        };

        setWebSocket(ws);
    }, []);

    /**
        Function for sending a message to the websocket \
        Needed for displaying an error message if the websocket is closed, which can happen at any time
     */
    const sendWSMessage = (message: string) => {
        if (!ws) return; // TODO: Error handling
        if (ws.readyState === ws.CLOSED) {
            handleStopQueuing(false);
            ErrorQueueClass.addError({ errorMessage: "Your connection was unexpectedly closed" });
            return;
        }
        ws.send(message);
    };

    const joinGame = (gameId: string) => {
        window.location.href = `/play/${gameId}`;
    };

    const startQueuingAPI = async (queue: QueueState) => {
        sendWSMessage(JSON.stringify({ type: "enqueue", game_mode: queue.gameMode, time_control: queue.timeControl }));
    };

    const startLinkAPI = async (queue: QueueState) => {
        try {
            const res = await axios({
                method: "get",
                url: "/api/play/create_link",
                params: {
                    game_mode: queue.gameMode,
                    time_control: queue.timeControl,
                },
            });
            res.data.link && joinGame(res.data.game_id);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    const handleStartQueueing: handleStartQueueingType = async (queue) => {
        switch (playAgainst) {
            case "random":
                startQueuingAPI(queue);
                setQueuing(queue);
                setShowQueuing(true);
                break;
            case "friend":
                // TODO: Implement friend play
                break;
            case "link":
                await startLinkAPI(queue);
                break;
        }
    };

    const stopQueuingAPI = () => {
        sendWSMessage(JSON.stringify({ type: "stop_queuing" }));
    };
    const handleStopQueuing = (callStopQueueingAPI: boolean = true) => {
        callStopQueueingAPI && stopQueuingAPI();
        setShowQueuing(false);
    };
    const handleStoppedQueuing = () => {
        setQueuing(null);
    };

    return (
        <>
            <Queuing
                queue={queuing ? queuing : undefined}
                show={showQueuing}
                cancelHandlers={{ onClosingCallback: handleStopQueuing, onClosedCallback: handleStoppedQueuing }}
            />
            <div css={findGameCss}>
                <h1 css={titleCss}>Find A Game</h1>
                <Paper customCss={mainPaperCss}>
                    <PlayAgainstPicker setPlayAgainst={setPlayAgainst} />
                    <TimeControlPicker disabled={!!queuing} setQueuing={handleStartQueueing} />
                </Paper>
            </div>
        </>
    );
}
