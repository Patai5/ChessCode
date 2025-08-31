/** @jsxImportSource @emotion/react */
import axios from "axios";
import { PATHS } from "components/constants";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import { GradientButtonPickerMethods } from "components/shared/GradientButtonPicker";
import { AppContext } from "hooks/appContext";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    FIND_GAME_API_RESPONSE_TYPE,
    FindGameApiMessageType,
    FindGameMessageApiResponse,
    GameFoundApiResponse,
} from "types/api/findGame";
import { ErrorApiResponse } from "types/api/play";
import { getWSUri } from "utils/websockets";
import FindGameContainer from "./FindGameContainer/FindGameContainer";
import { CloseFindGamePopupProps, SharedFindGameProps } from "./FindGameContainer/types";
import FriendPicker, { Username } from "./FriendPicker/FriendPicker";
import { playAgainstType } from "./PlayAgainstPicker/PlayAgainstPicker";
import Queuing, { QueueState } from "./Queuing/Queuing";
import { TimeControlPickerMethods } from "./TimeControlPicker/TimeControlPicker";

export type HandleStartQueueingType = (queue: QueueState) => Promise<void>;

type FindGameProps = SharedFindGameProps & Partial<CloseFindGamePopupProps>;

export default function FindGame(props: FindGameProps) {
    const { playAgainstPlayer = null, closeFindGamePopup } = props;

    const initialSelectedFriendValue = playAgainstPlayer ?? null;
    const initialPlayAgainstValue = playAgainstPlayer ? "friend" : "random";

    const [queuing, setQueuing] = React.useState<QueueState | null>(null);
    const [showQueuing, setShowQueuing] = React.useState(false);
    const [selectedFriend, setSelectedFriend] = React.useState<Username | null>(initialSelectedFriendValue);
    const [playAgainst, setPlayAgainst] = React.useState<playAgainstType>(initialPlayAgainstValue);
    const [isFindGamePopupOpen, setIsFindGamePopupOpen] = React.useState(true);

    const playAgainstPickerRef = React.useRef<GradientButtonPickerMethods | null>(null);
    const timeControlPickerRef = React.useRef<TimeControlPickerMethods | null>(null);
    const ws = React.useRef<WebSocket | null>(null);

    const appContext = React.useContext(AppContext);
    const navigate = useNavigate();

    const setError = (error: string) => {
        ErrorQueueClass.handleError(error);
        setShowQueuing(false);
    };

    const handleOnMessage = async (message: MessageEvent) => {
        const data: FindGameMessageApiResponse = JSON.parse(message.data);

        const ON_MESSAGE_HANDLERS: Record<FindGameApiMessageType, (data: FindGameMessageApiResponse) => void> = {
            [FIND_GAME_API_RESPONSE_TYPE.GAME_FOUND]: handleGameFound,
            [FIND_GAME_API_RESPONSE_TYPE.ERROR]: handleErrorResponse,
        };

        const onMessageHandler = ON_MESSAGE_HANDLERS[data.type];
        if (!onMessageHandler) {
            ErrorQueueClass.addError({ errorMessage: `Unknown message type received: ${data.type}` });
            return;
        }

        onMessageHandler(data);
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

    const handleCloseWebSocket = () => {
        if (ws.current && ws.current.readyState === ws.current.OPEN) {
            ws.current.close();
        }
    };

    const sendWSMessage = (message: string) => {
        if (!ws.current || ws.current.readyState !== ws.current.OPEN) {
            setError("Not connected to server");
            handleStopQueuing(false);
            handleStoppedQueuing();
            return;
        }
        ws.current.send(message);
    };

    const handleGameFound = (data: GameFoundApiResponse) => {
        joinGame(data.game_id);
    };

    const joinGame = (gameId: string) => {
        navigate(PATHS.PLAY(gameId));
    };

    const handleErrorResponse = (data: ErrorApiResponse) => {
        ErrorQueueClass.addError({ errorMessage: data.message });
        handleStopQueuing();
    };

    const startQueuingAPI = (queue: QueueState) => {
        sendWSMessage(
            JSON.stringify({
                type: "enqueue",
                game_mode: queue.gameMode,
                time_control: queue.timeControl,
                ...(queue.group && { group: queue.group }),
            }),
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
        setIsFindGamePopupOpen(false);
        setQueuing(queue);
        setShowQueuing(true);
        startQueuingAPI(queue);
    };

    const handleStartQueueing: HandleStartQueueingType = async (queue) => {
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

        setIsFindGamePopupOpen(true);
        setShowQueuing(false);
    };
    const handleStoppedQueuing = () => {
        setIsFindGamePopupOpen(true);
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

    const findGamePopupControls = closeFindGamePopup && {
        closeFindGamePopup: () => {
            handleCloseWebSocket();
            closeFindGamePopup();
        },
        isFindGamePopupOpen,
        setIsFindGamePopupOpen,
    };

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
            <FindGameContainer
                {...{
                    queuing,
                    selectedFriend,
                    playAgainst,
                    playAgainstPickerRef,
                    timeControlPickerRef,
                    handleStartQueueing,
                    handleSetPlayAgainst,
                    findGamePopupControls,
                }}
                {...props}
            />
        </>
    );
}
