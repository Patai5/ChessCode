import { PlayersProps as PlayersAPI } from "components/shared/Chess/ActionBar/ActionBar";
import { PlayersProps } from "components/shared/Chess/Chess";
import { Move, MoveInfo, MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { Color, PromotionPieceType } from "components/shared/Chess/ChessBoard/ChessLogic/pieces";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import React from "react";
import { GameResultApiResponse } from "types/api/gameResult";
import {
    ErrorApiResponse,
    GameStartedApiResponse,
    JoinApiResponse,
    MoveApiResponse,
    PLAY_API_RESPONSE_TYPE,
    PlayApiMessageType,
    PlayGameResultApiResponse,
    PlayOnMessageApiResponse,
    SendApiMessageData,
} from "types/api/play";
import { validateId } from "utils/chess";
import { typedEntries } from "utils/utils";
import { getWSUri } from "utils/websockets";

const ColorName = { white: Color.White, black: Color.Black };

export const CONNECTION_STATE = {
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    ERROR: "ERROR",
} as const;

type Props = {
    gameId: string | undefined;
    clientUsername: string | null;
    setColor: (color: Color) => void;
    setGameStarted: (gameStarted: boolean) => void;
    handleClientMakeMove: (move: Move, promotionPiece: PromotionPieceType | null) => void;
};

export const usePlayApi = (props: Props) => {
    const { gameId, clientUsername, setColor, setGameStarted, handleClientMakeMove } = props;

    const [connectionState, setConnectionState] = React.useState<keyof typeof CONNECTION_STATE>(
        CONNECTION_STATE.CONNECTING,
    );
    const [gameResult, setGameResult] = React.useState<GameResultApiResponse | null>(null);
    const [highlightDrawButton, setHighlightDrawButton] = React.useState(false);
    const [players, setPlayers] = React.useState<PlayersProps | null>(null);

    const ws = React.useRef<WebSocket | null>(null);

    const setError = (error: string) => {
        ErrorQueueClass.addError({ errorMessage: error });
        setConnectionState(CONNECTION_STATE.ERROR);
    };

    const handleGameIdValidation = (): boolean => {
        const isValidId = validateId(gameId);
        if (!isValidId) setError(isValidId);

        return !!isValidId;
    };

    const handleOnMessage = (message: MessageEvent) => {
        const data: PlayOnMessageApiResponse = JSON.parse(message.data);

        const ON_MESSAGE_HANDLERS: Record<PlayApiMessageType, (data: PlayOnMessageApiResponse) => void> = {
            [PLAY_API_RESPONSE_TYPE.JOIN]: handleJoined,
            [PLAY_API_RESPONSE_TYPE.GAME_STARTED]: handleGameStarted,
            [PLAY_API_RESPONSE_TYPE.MOVE]: handleMove,
            [PLAY_API_RESPONSE_TYPE.GAME_RESULT]: handleGameResult,
            [PLAY_API_RESPONSE_TYPE.OFFER_DRAW]: handleReceivedDrawOffer,
            [PLAY_API_RESPONSE_TYPE.ERROR]: handleErrorResponse,
        };

        const onMessageHandler = ON_MESSAGE_HANDLERS[data.type];
        if (!onMessageHandler) {
            ErrorQueueClass.addError({ errorMessage: `Unknown message type received: ${data.type}` });
            return;
        }

        onMessageHandler(data);
    };

    const handleErrorResponse = (data: ErrorApiResponse) => {
        ErrorQueueClass.addError({ errorMessage: data.message });
        setConnectionState(CONNECTION_STATE.ERROR);
    };

    const handleReceivedDrawOffer = () => {
        setHighlightDrawButton(true);
    };

    const updatePlayersFromAPI = (playersAPI: PlayersAPI) => {
        const playersProps = {} as PlayersProps;
        for (const [color, player] of typedEntries(playersAPI)) {
            playersProps[ColorName[color]] = { ...player };
        }
        setPlayers(playersProps);
    };

    const updateMove = (moveName: MoveName) => {
        const { move, promotionPiece } = Move.fromName(moveName);
        handleClientMakeMove(move, promotionPiece);
    };

    const handleMove = (data: MoveApiResponse) => {
        setHighlightDrawButton(false);
        updatePlayersFromAPI(data.players);
        updateMove(data.move);
    };

    const handleGameResult = (data: PlayGameResultApiResponse) => {
        const { winner, termination } = data;

        setHighlightDrawButton(false);
        setGameResult({ winner, termination });
    };

    const handleJoined = (data: JoinApiResponse) => {
        if (!clientUsername) return setError("Username is not set");

        for (const [color, player] of typedEntries(data.players)) {
            const isPlayer = player.username === clientUsername;
            if (isPlayer) setColor(ColorName[color]);
        }
        updatePlayersFromAPI(data.players);

        for (const move of data.moves) {
            updateMove(move);
        }

        setGameStarted(data.game_started);
        setHighlightDrawButton(data.offer_draw);

        setConnectionState(CONNECTION_STATE.CONNECTED);
    };

    const handleGameStarted = (data: GameStartedApiResponse) => {
        setGameStarted(true);
        updatePlayersFromAPI(data.players);
    };

    const sendMessage = (data: SendApiMessageData) => {
        if (!ws.current || ws.current.readyState !== ws.current.OPEN) {
            setError("Not connected to server");
            return;
        }

        const messageData = JSON.stringify(data);
        ws.current.send(messageData);
    };

    React.useEffect(() => {
        if (!handleGameIdValidation()) return;
        if (!clientUsername) return;
        if (ws.current) return;

        const createWs = new WebSocket(getWSUri() + "/api/play/" + gameId);

        createWs.onopen = () => {
            ws.current = createWs;
            joinGame();
        };
        createWs.onmessage = (event) => {
            handleOnMessage(event);
        };
        createWs.onclose = (event) => {
            const REGULAR_CLOSE_CODE = 1000;
            if (event.code === REGULAR_CLOSE_CODE) return;

            setError("Connection closed - CODE: " + event.code);
        };
        createWs.onerror = () => {
            setError("Error connecting to server");
        };

        return () => {
            if (createWs.readyState === createWs.OPEN) createWs.close();
        };
    }, [clientUsername]);

    const joinGame = () => {
        sendMessage({ type: "join", game_id: gameId });
    };

    const broadcastMove = (move: MoveInfo) => {
        setHighlightDrawButton(false);
        sendMessage({ type: "move", move: move.toName() });
    };

    const handleResign = () => {
        sendMessage({ type: "resign" });
    };

    const handleOfferDraw = () => {
        sendMessage({ type: "offer_draw" });
    };

    return {
        players,
        gameResult,
        highlightDrawButton,
        connectionState,
        broadcastMove,
        handleResign,
        handleOfferDraw,
    };
};
