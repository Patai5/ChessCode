/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import Paper from "components/shared/Paper";
import React from "react";
import { getWSUri } from "utils/websockets";
import FriendPicker from "./FriendPicker/FriendPicker";
import { Username } from "./FriendPicker/Friends/Friends";
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
    const [selectedFriend, setSelectedFriend] = React.useState<Username | null>(null);
    const [playAgainst, setPlayAgainst] = React.useState<playAgainstType>("random");
    const ws = React.useRef<WebSocket | null>(null);

    const setError = (error: string) => {
        ErrorQueueClass.handleError(error);
        setShowQueuing(false);
    };

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
                setError(data.message);
                break;
            default:
                ErrorQueueClass.addError({ errorMessage: `Unknown message type received: ${data.type}` });
        }
    };

    React.useLayoutEffect(() => {
        if (ws.current) return;

        const createWs = new WebSocket(getWSUri() + "/api/play/queue");
        ws.current = createWs;

        createWs.onmessage = (e) => {
            handleOnMessage(e);
        };
        createWs.onclose = (ev) => {
            if (ev.code === 1000) return; // Normal closure
            setError("Connection closed - CODE: " + ev.code);
        };
        createWs.onerror = (err) => {
            setError("Error connecting to server");
        };

        return () => {
            if (createWs.readyState === createWs.OPEN) createWs.close();
        };
    }, []);

    const sendWSMessage = (message: string) => {
        if (!ws.current || ws.current.readyState !== ws.current.OPEN) {
            setError("Not connected to server");
            handleStopQueuing(false);
            handleStoppedQueuing();
            return;
        }
        ws.current.send(message);
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
            res.data.game_id && joinGame(res.data.game_id);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    const handleStartQueueing: handleStartQueueingType = async (queue) => {
        switch (playAgainst) {
            case "random":
                setQueuing(queue);
                setShowQueuing(true);
                startQueuingAPI(queue);
                break;
            case "friend":
                console.log("WILL PLAY AGAINST: ", selectedFriend);
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
    const handleSetPlayAgainst = (playAgainst: playAgainstType) => {
        setPlayAgainst(playAgainst);
        setSelectedFriend(null);
    };

    const isTimeControlPickerEnabled = !queuing && (playAgainst !== "friend" || !!selectedFriend);

    return (
        <>
            <Queuing
                queue={queuing ? queuing : undefined}
                show={showQueuing}
                cancelHandlers={{ onClosingCallback: handleStopQueuing, onClosedCallback: handleStoppedQueuing }}
            />
            <FriendPicker
                show={playAgainst === "friend" && !selectedFriend}
                setSelectedFriend={setSelectedFriend}
                closeFriendPicker={() => setPlayAgainst("random")}
            />
            <div css={findGameCss}>
                <h1 css={titleCss}>Find A Game</h1>
                <Paper customCss={mainPaperCss}>
                    <PlayAgainstPicker setPlayAgainst={handleSetPlayAgainst} />
                    <TimeControlPicker disabled={!isTimeControlPickerEnabled} setQueuing={handleStartQueueing} />
                </Paper>
            </div>
        </>
    );
}
