import axios from "axios";
import { PlayersProps } from "components/shared/Chess/ActionBar/ActionBar";
import { RefType } from "components/shared/Chess/ChessBoard/ChessBoard";
import { MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { Color } from "components/shared/Chess/ChessBoard/ChessLogic/pieces";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import { AppContext } from "hooks/appContext";
import React from "react";
import { useParams } from "react-router-dom";
import { GameResultApiResponse } from "types/api/gameResult";
import { ReplayGameAPIResponse } from "types/api/replayGame";
import { validateId } from "utils/chess";
import { useReplayGameActions } from "./useReplayGameActions";

const REPLAY_GAME_API_ENDPOINT = "/api/play/game/";

export type ReplayGameState = {
    playedMoves: MoveName[];
    players: PlayersProps;
    gameResult: GameResultApiResponse;
    color: Color;
};

/**
 * Manages the state and actions for the replay game component. Fetches the game data from the API.
 */
export const useReplayGame = () => {
    const [replayGameState, setReplayGameState] = React.useState<ReplayGameState | null>(null);
    const chessboardRef = React.useRef<RefType>(null);
    const { username } = React.useContext(AppContext);
    const { id: gameId } = useParams();

    /**
     * Fetches the game data when the component mounts.
     */
    React.useEffect(() => {
        const isValidId = handleGameIdValidation();
        if (!isValidId) return;

        fetchGame();
    }, []);

    /**
     * Handles the game ID validation. If the ID is invalid, displays an error message.
     *
     * @returns A boolean indicating whether the ID is valid
     */
    const handleGameIdValidation = (): boolean => {
        const isValidId = validateId(gameId);
        if (!isValidId) ErrorQueueClass.addError({ errorMessage: isValidId });

        return !!isValidId;
    };

    /**
     * Fetches the game data from the API and updates the state with the response.
     */
    const fetchGame = async () => {
        try {
            const { data } = await axios({ url: `${REPLAY_GAME_API_ENDPOINT}${gameId}` });
            handleReplayFromApiResponse(data);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    /**
     * Updates the state with the response from the API.
     */
    const handleReplayFromApiResponse = (response: ReplayGameAPIResponse) => {
        const { moves, players, termination, winner_color } = response;

        const color = username === players.black.username ? Color.Black : Color.White;

        const state = {
            playedMoves: moves,
            players: players,
            gameResult: { winner: winner_color, termination: termination },
            color,
        };
        setReplayGameState(state);
    };

    const actions = useReplayGameActions({ replayGameState, chessboardRef });

    return { replayGameState, chessboardRef, actions };
};
