/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import TimeControlPicker from "./TimeControlPicker/TimeControlPicker";
import PlayAgainstPicker from "./PlayAgainstPicker/PlayAgainstPicker";
import Paper from "components/shared/Paper";
import Queuing, { QueueState, animationLength } from "./Queuing/Queuing";
import { sleep } from "utils/utils";
import { getWSUri, isWSMessageError, WSErrorCodes } from "utils/websockets";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";

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
    const [queing, setQueing] = React.useState<false | QueueState>(false);
    const [showQueuing, setShowQueuing] = React.useState(false);
    const [ws, setWebSocket] = React.useState<WebSocket | null>(null);

    React.useEffect(() => {
        // Configuring the websocket
        // TODO: Better error handling, websocket might not be created yet when already calling the api
        // Also when the socket gets closed we should create a new one
        const ws = new WebSocket(getWSUri() + "/api/play/queue");

        ws.onmessage = async (e) => {
            const data = JSON.parse(e.data);
            if (isWSMessageError(e)) {
                // If for whatever reason a user is already in a queue, we won't show an error and instead remove him from the queue
                if (data.message === "User is already in queue") {
                    await stopQueuingAPI();
                    if (!queing) return;
                    await startQueuingAPI(queing);
                    return;
                }
                ErrorQueueClass.addError({ errorMessage: data.message });
                return handleStopQueuing(false);
            }
            // TODO: Start the game
        };

        ws.onclose = (e) => {
            if (e.code in WSErrorCodes)
                ErrorQueueClass.addError({ errorMessage: WSErrorCodes[e.code as keyof typeof WSErrorCodes] });
            else ErrorQueueClass.addError({ errorMessage: "Your connection was unexpectedly closed" });
            handleStopQueuing(false);
        };

        ws.onerror = (e) => {
            ErrorQueueClass.addError({ errorMessage: "Error connecting to server" });
            handleStopQueuing(false);
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

    const startQueuingAPI = async (queue: QueueState) => {
        sendWSMessage(JSON.stringify({ type: "enqueue", game_mode: queue.gameMode, time_control: queue.timeControl }));
    };
    const handleStartQueueing: handleStartQueueingType = async (queue) => {
        startQueuingAPI(queue);
        setQueing(queue);
        setShowQueuing(true);
    };

    const stopQueuingAPI = async () => {
        sendWSMessage(JSON.stringify({ type: "stop_queuing" }));
    };
    const handleStopQueuing = async (callCancelApi: boolean) => {
        if (callCancelApi) stopQueuingAPI();
        setShowQueuing(false);

        await sleep(animationLength);
        setQueing(false);
    };

    return (
        <>
            {queing && <Queuing queue={queing} show={showQueuing} stopQueuing={() => handleStopQueuing(true)} />}
            <div css={findGameCss}>
                <h1 css={titleCss}>Find A Game</h1>
                <Paper customCss={mainPaperCss}>
                    <PlayAgainstPicker />
                    <TimeControlPicker disabled={!!queing} setQueing={handleStartQueueing} />
                </Paper>
            </div>
        </>
    );
}
