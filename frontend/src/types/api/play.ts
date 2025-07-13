import { PlayersProps } from "components/shared/Chess/Chess";
import { MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { GameResultApiResponse } from "./gameResult";

export const PLAY_API_RESPONSE_TYPE = {
    JOIN: "join",
    GAME_STARTED: "game_started",
    MOVE: "move",
    GAME_RESULT: "game_result",
    OFFER_DRAW: "offer_draw",
    ERROR: "error",
} as const;
export type PlayApiMessageType = (typeof PLAY_API_RESPONSE_TYPE)[keyof typeof PLAY_API_RESPONSE_TYPE];

export type PlayOnMessageApiResponse =
    | JoinApiResponse
    | GameStartedApiResponse
    | MoveApiResponse
    | PlayGameResultApiResponse
    | OfferDrawApiResponse
    | ErrorApiResponse;

export type JoinApiResponse = {
    type: typeof PLAY_API_RESPONSE_TYPE.JOIN;
    players: PlayersProps;
    moves: MoveName[];
    offer_draw: boolean;
    game_started: boolean;
};

export type GameStartedApiResponse = {
    type: typeof PLAY_API_RESPONSE_TYPE.GAME_STARTED;
    players: PlayersProps;
};

export type MoveApiResponse = {
    type: typeof PLAY_API_RESPONSE_TYPE.MOVE;
    move: MoveName;
    players: PlayersProps;
};

export type PlayGameResultApiResponse = GameResultApiResponse & {
    type: typeof PLAY_API_RESPONSE_TYPE.GAME_RESULT;
};

type OfferDrawApiResponse = {
    type: typeof PLAY_API_RESPONSE_TYPE.OFFER_DRAW;
};

export type ErrorApiResponse = {
    type: typeof PLAY_API_RESPONSE_TYPE.ERROR;
    message: string;
};

export const PLAY_API_MESSAGE_TYPE = {
    JOIN: PLAY_API_RESPONSE_TYPE.JOIN,
    MOVE: PLAY_API_RESPONSE_TYPE.MOVE,
    OFFER_DRAW: PLAY_API_RESPONSE_TYPE.OFFER_DRAW,
    RESIGN: "resign",
};

export type SendApiMessageData =
    | SendApiJoinMessageData
    | SendApiMoveMessageData
    | SendApiOfferDrawMessageData
    | SendApiResignMessageData;

type SendApiJoinMessageData = {
    type: typeof PLAY_API_MESSAGE_TYPE.JOIN;
    game_id: string;
};

export type SendApiMoveMessageData = {
    type: typeof PLAY_API_MESSAGE_TYPE.MOVE;
    move: MoveName;
};

type SendApiOfferDrawMessageData = {
    type: typeof PLAY_API_MESSAGE_TYPE.OFFER_DRAW;
};

type SendApiResignMessageData = {
    type: typeof PLAY_API_MESSAGE_TYPE.RESIGN;
};
