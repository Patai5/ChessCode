import { RefType } from "components/shared/Chess/ChessBoard/ChessBoard";
import { Move } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import React from "react";
import { ReplayGameState } from "./useReplayGame";

type Props = {
    replayGameState: ReplayGameState | null;
    chessboardRef: React.RefObject<RefType>;
};

/**
 * Manages the actions for the replay game component.
 * - Handles their click callbacks and updated their toggle states
 * - Keeps the reference to the chessboard component, it should be set later in the parent component.
 */
export const useReplayGameActions = (props: Props) => {
    const { replayGameState, chessboardRef } = props;
    const [currentMoveIndex, setCurrentMoveIndex] = React.useState(0);

    /**
     * Updates the chessboard with the move at the given index.
     */
    const updateMoveFromIndex = (moveIndex: number) => {
        if (!replayGameState) return;
        if (!chessboardRef.current) return;

        const moveName = replayGameState.playedMoves[moveIndex];
        const { move, promotionPiece } = Move.fromName(moveName);

        chessboardRef.current.clientMakeMove(move, promotionPiece);
    };

    /**
     * Undoes the last move on the chessboard.
     */
    const undoMove = () => {
        if (!chessboardRef.current) return;

        chessboardRef.current.clientUndoMove();
    };

    const totalPlayedMoves = replayGameState?.playedMoves.length || 0;
    const canGoBack = currentMoveIndex > 0;
    const canGoForward = currentMoveIndex < totalPlayedMoves;

    /**
     * Moves the chessboard back one move.
     */
    const goBack = () => {
        if (!canGoBack) return;

        undoMove();
        setCurrentMoveIndex(currentMoveIndex - 1);
    };

    /**
     * Moves the chessboard forward one move.
     */
    const goForward = () => {
        if (!canGoForward) return;

        updateMoveFromIndex(currentMoveIndex);
        setCurrentMoveIndex(currentMoveIndex + 1);
    };

    /**
     * Moves the chessboard to the start of the game.
     */
    const goToStart = () => {
        Array.from({ length: currentMoveIndex }).forEach(() => undoMove());
        setCurrentMoveIndex(0);
    };

    /**
     * Moves the chessboard to the end of the game.
     */
    const goToEnd = () => {
        const remainingMoves = totalPlayedMoves - currentMoveIndex;
        Array.from({ length: remainingMoves }).forEach((_, i) => {
            updateMoveFromIndex(currentMoveIndex + i);
        });

        setCurrentMoveIndex(totalPlayedMoves);
    };

    return {
        goBack: { callback: goBack, isEnabled: canGoBack },
        goForward: { callback: goForward, isEnabled: canGoForward },
        goToStart: { callback: goToStart, isEnabled: canGoBack },
        goToEnd: { callback: goToEnd, isEnabled: canGoForward },
    };
};
