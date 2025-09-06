import React from "react";
import { Move, MoveInfo, Position } from "../ChessBoard/ChessLogic/board";
import Chess from "../ChessBoard/ChessLogic/chess";
import { Color, Piece, PromotionPieceType } from "../ChessBoard/ChessLogic/pieces";
import { makeMove } from "./handleMovePiece";
import { maybeGetPromotionPiece, shouldShowPromotion } from "./handlePromotions";
import { selectPiece } from "./handleSelectPiece";

export type SetChessBoardState = React.Dispatch<React.SetStateAction<ChessBoardState>>;

export type ChessBoardState = {
    pieces: Piece[];
    selectedPiece: Piece | null;
    hoveringOverSquare: Position | null;
    validMoves: Move[];
    inProgressPromotionMove: Move | null;
    lastMove: MoveInfo | null;
};

export type ChessBoardStateHandlersProps = {
    chessBoardState: ChessBoardState;
    chess: Chess;
    colorToPlay: Color;
    setColorToPlay: (color: Color) => void;
    setBroadcastMove: (broadcastMove: ((move: MoveInfo) => void) | null) => void;
    handleClientMakeMove: (move: Move, promotionPiece: PromotionPieceType | null) => void;
    handleClientUndoMove: () => void;
    handleHoveringOver: (position: Position) => void;
    handleMovedTo: (moveTo: Position) => void;
    handleSelectPiece: (piece: Piece | null) => void;
    handleSetPromotionPiece: (position: Position | null) => void;
    handleMaybeGetPromotionPiece: (selectedPosition: Position) => PromotionPieceType | null;
};

type Props = {
    color: Color;
    isEnabled: boolean;
};

export const useChessBoardState = (props: Props): ChessBoardStateHandlersProps => {
    const { color, isEnabled } = props;

    const [colorToPlay, setColorToPlay] = React.useState<Color>(color);
    const broadcastMove = React.useRef<((move: MoveInfo) => void) | null>(null);
    const chess = React.useRef(new Chess()).current;

    const [chessBoardState, setChessBoardState] = React.useState<ChessBoardState>({
        pieces: chess.board.getPieces(),
        selectedPiece: null,
        hoveringOverSquare: null,
        validMoves: [],
        inProgressPromotionMove: null,
        lastMove: null,
    });

    const handleHoveringOver = (position: Position | null) => {
        setChessBoardState((chessBoardState) => ({ ...chessBoardState, hoveringOverSquare: position }));
    };

    /**
     * Handles the piece being moved to a new position.
     * - If the move results in a promotion, it sets the in-progress promotion move state.
     * - Otherwise, it makes the move directly.
     */
    const handleMovedTo = (moveTo: Position) => {
        const { selectedPiece } = chessBoardState;
        if (!selectedPiece) throw new Error("No piece selected to move");

        const move = new Move(selectedPiece.position, moveTo);

        const showPromotion = shouldShowPromotion(selectedPiece, move);
        if (showPromotion) {
            return setChessBoardState((chessBoardState) => ({ ...chessBoardState, inProgressPromotionMove: move }));
        }

        const moveInfo = moveAndEnsureBroadcastMove({ move, maybePromotionPiece: null });
        const options = { moveInfo, chess, isEnabled, color, setColorToPlay };

        setChessBoardState((chessBoardState) => makeMove(chessBoardState, options));
    };

    /**
     * Returns the promotion piece based on the selected position.
     * - null if the position does not correspond to a promotion piece, or if there is no in-progress promotion move.
     */
    const handleMaybeGetPromotionPiece = (selectedPosition: Position): PromotionPieceType | null => {
        const { inProgressPromotionMove } = chessBoardState;
        if (!inProgressPromotionMove) return null;

        return maybeGetPromotionPiece({ inProgressPromotionMove, selectedPosition, color });
    };

    /**
     * Gets the promotion piece based on the selected position, and if valid, makes the move with the promotion.
     * - Updates the chess board state, clearing the in-progress promotion move if the selection is invalid.
     * - Otherwise makes the move with the selected promotion piece and updates the state accordingly.
     */
    const handleSetPromotionPiece = (selectedPosition: Position) => {
        const { inProgressPromotionMove } = chessBoardState;
        if (!inProgressPromotionMove) return;

        const maybePromotionPiece = maybeGetPromotionPiece({ inProgressPromotionMove, selectedPosition, color });
        if (!maybePromotionPiece) {
            return setChessBoardState((chessboardState) => ({ ...chessboardState, inProgressPromotionMove: null }));
        }

        const moveInfo = moveAndEnsureBroadcastMove({ move: inProgressPromotionMove, maybePromotionPiece });
        const options = { isEnabled, chess, moveInfo, color, setColorToPlay };

        setChessBoardState((chessBoardState) => makeMove(chessBoardState, options));
    };

    const handleSelectPiece = (piece: Piece | null) => {
        const options = { chess, isEnabled, piece, color };
        setChessBoardState((boardState) => selectPiece(boardState, options));
    };

    /**
     * Handles the client-side making a move.
     * - The actual move on the chess instance has to be performed outside the set state, as otherwise we would be
     *      risking calling it multiple times due to how React batches state updates.
     */
    const handleClientMakeMove = (move: Move, promotionPiece: PromotionPieceType | null) => {
        const moveInfo = chess.move(move, promotionPiece);
        const options = { isEnabled, color, moveInfo, chess, promotionPiece, setColorToPlay };

        setChessBoardState((chessBoardState) => makeMove(chessBoardState, options));
    };

    const handleClientUndoMove = () => {
        const moveInfo = chess.undoMove();
        setChessBoardState((chessBoardState) => ({ ...chessBoardState, lastMove: moveInfo }));

        setColorToPlay(chess.board.colorToPlay);
    };

    const setBroadcastMove = (newBroadcastMove: (move: MoveInfo) => void) => {
        broadcastMove.current = newBroadcastMove;
    };

    /**
     * Makes the move on the chess instance, and ensures that the move is broadcasted using the broadcastMove function.
     */
    const moveAndEnsureBroadcastMove = (options: {
        move: Move;
        maybePromotionPiece: PromotionPieceType | null;
    }): MoveInfo => {
        const { move, maybePromotionPiece } = options;
        const { current: broadcastMoveFunction } = broadcastMove;

        if (!broadcastMoveFunction) {
            throw new Error("UNREACHABLE: broadcastMove function is required for broadcasting moves");
        }

        const moveInfo = chess.move(move, maybePromotionPiece);
        broadcastMoveFunction(moveInfo);

        return moveInfo;
    };

    return {
        chessBoardState,
        chess,
        colorToPlay,
        setColorToPlay,
        setBroadcastMove,
        handleClientMakeMove,
        handleClientUndoMove,
        handleMaybeGetPromotionPiece,
        handleSetPromotionPiece,
        handleSelectPiece,
        handleHoveringOver,
        handleMovedTo,
    };
};
