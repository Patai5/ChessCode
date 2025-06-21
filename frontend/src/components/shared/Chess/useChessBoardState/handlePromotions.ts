import { Move, Position } from "../ChessBoard/ChessLogic/board";
import { Color, Piece, Pieces, PromotionPieces, PromotionPieceType } from "../ChessBoard/ChessLogic/pieces";
import { makeMove, MoveOptions } from "./handleMovePiece";
import { ChessBoardState } from "./useChessBoardState";

/**
 * Returns the promotion piece that matches the given selected promotion piece selection position.
 * - Return null if no promotion is in progress, or if the position does not match any promotion piece.
 */
export const maybeGetPromotionPiece = (
    chessBoardState: ChessBoardState,
    options: { selectedPosition: Position; color: Color },
): PromotionPieceType | null => {
    const { selectedPosition, color } = options;
    const { inProgressPromotionMove } = chessBoardState;

    if (!inProgressPromotionMove) return null;

    const isSameFile = inProgressPromotionMove.to.file === selectedPosition.file;
    if (!isSameFile) return null;

    let currentRank = inProgressPromotionMove.to.rank;
    for (const promotionPiece of PromotionPieces) {
        const isMatchingRank = currentRank === selectedPosition.rank;
        if (isMatchingRank) return promotionPiece;

        currentRank += color === Color.White ? -1 : 1;
    }

    return null;
};

/**
 * Returns a boolean indicating whether a promotion should be shown for the given piece and move.
 */
export const shouldShowPromotion = (piece: Piece, move: Move): boolean => {
    const isPawnPiece = piece instanceof Pieces.Pawn;
    if (!isPawnPiece) return false;

    const reachedWhitePromotionRank = piece.color === Color.White && move.to.rank === 7;
    const reachedBlackPromotionRank = piece.color === Color.Black && move.to.rank === 0;

    return reachedWhitePromotionRank || reachedBlackPromotionRank;
};

export const selectPromotion = (
    chessBoardState: ChessBoardState,
    options: MoveOptions & { selectedPosition: Position },
) => {
    const { chess } = options;

    const { inProgressPromotionMove } = chessBoardState;
    if (!inProgressPromotionMove) return chessBoardState;

    const maybePromotionPiece = maybeGetPromotionPiece(chessBoardState, options);
    if (!maybePromotionPiece) return { ...chessBoardState, inProgressPromotionMove: null };

    const moveInfo = chess.move(inProgressPromotionMove, maybePromotionPiece);
    const makeMoveOptions = { ...options, moveInfo, promotionPiece: maybePromotionPiece };

    const updatedBoardState = makeMove(chessBoardState, makeMoveOptions);

    return { ...updatedBoardState, inProgressPromotionMove: null };
};
