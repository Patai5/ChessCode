export const validateId = (gameId: string | undefined): true | string => {
    if (!gameId) {
        return "No game ID provided";
    }
    if (!gameId.match(/^(([a-zA-Z0-9]{8})|(\d+))$/)) {
        return "Invalid game ID";
    }
    return true;
};
