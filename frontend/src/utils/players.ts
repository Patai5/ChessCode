import { PlayerProps } from "components/shared/Chess/ActionBar/ActionBar";
import { GamePlayerApi } from "types/api/player";

/**
 * Parses the API player response into PlayerProps
 */
export const parsePlayerApiResponse = (playerApi: GamePlayerApi): PlayerProps => {
    const { time, status } = playerApi;

    const maybeUsername = "username" in playerApi && playerApi.username;
    const username = maybeUsername || null;

    return { username, time, friendStatus: status };
};
