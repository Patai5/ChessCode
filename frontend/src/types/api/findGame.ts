export const FIND_GAME_API_RESPONSE_TYPE = {
    GAME_FOUND: "game_found",
    ERROR: "error",
} as const;
export type FindGameApiMessageType = (typeof FIND_GAME_API_RESPONSE_TYPE)[keyof typeof FIND_GAME_API_RESPONSE_TYPE];

export type FindGameMessageApiResponse = GameFoundApiResponse | ErrorApiResponse;

export type GameFoundApiResponse = {
    type: typeof FIND_GAME_API_RESPONSE_TYPE.GAME_FOUND;
    game_id: string;
};

export type ErrorApiResponse = {
    type: typeof FIND_GAME_API_RESPONSE_TYPE.ERROR;
    message: string;
};
