/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import { GradientButtonPickerMethods } from "components/shared/GradientButtonPicker";
import Paper from "components/shared/Paper";
import { AppContext } from "hooks/appContext";
import React from "react";
import { getWSUri } from "utils/websockets";
import FriendPicker, { Username } from "./FriendPicker/FriendPicker";
import PlayAgainstPicker, { playAgainstType } from "./PlayAgainstPicker/PlayAgainstPicker";
import Queuing, { QueueState } from "./Queuing/Queuing";
import TimeControlPicker, { TimeControlPickerMethods } from "./TimeControlPicker/TimeControlPicker";

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

export default function FindGame() {
    const [queuing, setQueuing] = React.useState<QueueState | null>(null);
    const [showQueuing, setShowQueuing] = React.useState(false);
    const [selectedFriend, setSelectedFriend] = React.useState<Username | null>(null);
    const [playAgainst, setPlayAgainst] = React.useState<playAgainstType>("random");
    const playAgainstPickerRef = React.useRef<GradientButtonPickerMethods | null>(null);
    const timeControlPickerRef = React.useRef<TimeControlPickerMethods | null>(null);
    const appContext = React.useContext(AppContext);
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
        createWs.onerror = () => {
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
        sendWSMessage(
            JSON.stringify({
                type: "enqueue",
                game_mode: queue.gameMode,
                time_control: queue.timeControl,
                ...(queue.group && { group: queue.group }),
            })
        );
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
            if (res.data.game_id) joinGame(res.data.game_id);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    const startQueueing = (queue: QueueState) => {
        setQueuing(queue);
        setShowQueuing(true);
        startQueuingAPI(queue);
    };

    const handleStartQueueing: handleStartQueueingType = async (queue) => {
        switch (playAgainst) {
            case "random":
                startQueueing(queue);
                break;
            case "friend":
                if (selectedFriend) {
                    queue.group = [selectedFriend!, appContext.username!];
                    queue.group.sort();
                }
                startQueueing(queue);
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
        if (callStopQueueingAPI) stopQueuingAPI();
        setShowQueuing(false);
    };
    const handleStoppedQueuing = () => {
        setQueuing(null);
        resetTimeControlPicker();
    };
    const handleSetPlayAgainst = (playAgainst: playAgainstType) => {
        if (playAgainst === "random") resetPlayAgainstPicker();
        setPlayAgainst(playAgainst);
        setSelectedFriend(null);
    };

    const resetTimeControlPicker = () => {
        timeControlPickerRef.current?.resetButtons();
    };
    const resetPlayAgainstPicker = () => {
        playAgainstPickerRef.current?.resetButtons();
    };

    const isTimeControlPickerEnabled = !queuing && (playAgainst !== "friend" || !!selectedFriend);

    return (
        <>
            <Queuing
                queue={queuing ? queuing : undefined}
                selectedFriend={selectedFriend}
                show={showQueuing}
                cancelHandlers={{ onClosingCallback: handleStopQueuing, onClosedCallback: handleStoppedQueuing }}
            />
            <FriendPicker
                show={playAgainst === "friend" && !selectedFriend}
                setSelectedFriend={setSelectedFriend}
                closeFriendPicker={() => handleSetPlayAgainst("random")}
            />
            <div css={findGameCss}>
                <h1 css={titleCss}>Find A Game</h1>
                <Paper customCss={mainPaperCss}>
                    <PlayAgainstPicker
                        enabled={!queuing}
                        setPlayAgainst={handleSetPlayAgainst}
                        ref={playAgainstPickerRef}
                    />
                    <TimeControlPicker
                        enabled={isTimeControlPickerEnabled}
                        setQueuing={handleStartQueueing}
                        ref={timeControlPickerRef}
                    />
                </Paper>
            </div>
        </>
    );
}
