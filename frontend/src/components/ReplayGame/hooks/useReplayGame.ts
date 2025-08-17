import axios from "axios";
import { PlayersProps } from "components/shared/Chess/Chess";
import { MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { Color } from "components/shared/Chess/ChessBoard/ChessLogic/pieces";
import { useChessBoardState } from "components/shared/Chess/useChessBoardState/useChessBoardState";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import React from "react";
import { useParams } from "react-router-dom";
import { GameApiResponse } from "types/api/game";
import { GameResultApiResponse } from "types/api/gameResult";
import { validateId } from "utils/chess";
import { parsePlayerApiResponse } from "utils/players";
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
    const handleReplayFromApiResponse = (response: GameApiResponse) => {
        const { moves, players, termination, winner_color } = response;

        const color = players.white.is_current_user ? Color.White : Color.Black;
        const playersProps = {
            [Color.White]: parsePlayerApiResponse(players.white),
            [Color.Black]: parsePlayerApiResponse(players.black),
        };

        const state = {
            playedMoves: moves,
            players: playersProps,
            gameResult: { winner: winner_color, termination: termination },
            color,
        };
        setReplayGameState(state);
    };

    const chessBoardStateHandlers = useChessBoardState({
        color: replayGameState?.color ?? Color.White,
        isEnabled: false,
    });

    const actions = useReplayGameActions({ replayGameState, ...chessBoardStateHandlers });

    return { replayGameState, actions, chessBoardStateHandlers };
};
