const GAME_ID_REGEX = /^(([a-zA-Z0-9]{8})|(\d+))$/;

/**
 * Validates the given game ID
 *
 * @returns `true` if the game ID is valid, otherwise an error message
 */
export const validateId = (gameId: string | undefined): true | string => {
    if (!gameId) return "No game ID provided";
    if (!gameId.match(GAME_ID_REGEX)) return "Invalid game ID";

    return true;
};
