import { Move, MoveInfo, Position } from "../ChessBoard/ChessLogic/board";
import { Color, PromotionPieceType } from "../ChessBoard/ChessLogic/pieces";
import { shouldShowPromotion } from "./handlePromotions";
import { selectPiece, SelectPieceOptions } from "./handleSelectPiece";
import { ChessBoardState } from "./useChessBoardState";

export type MoveOptions = Omit<SelectPieceOptions, "piece"> & {
    setColorToPlay: (color: Color) => void;
    promotionPiece?: PromotionPieceType | null;
    broadcastMove?: (moveInfo: MoveInfo, promotionPiece?: PromotionPieceType | null) => void;
};

export const handleMoveTo = (
    chessBoardState: ChessBoardState,
    options: MoveOptions & { moveTo: Position },
): ChessBoardState => {
    const { moveTo, chess } = options;
    const { selectedPiece } = chessBoardState;

    if (!selectedPiece) throw new Error("No piece selected to move");

    const move = new Move(selectedPiece.position, moveTo);
    const showPromotion = shouldShowPromotion(selectedPiece, move);

    if (showPromotion) return { ...chessBoardState, inProgressPromotionMove: move };

    const moveInfo = chess.move(move);
    return makeMove(chessBoardState, { ...options, moveInfo });
};

export const makeMove = (
    chessBoardState: ChessBoardState,
    options: MoveOptions & { moveInfo: MoveInfo },
): ChessBoardState => {
    const { moveInfo, chess, promotionPiece, setColorToPlay, broadcastMove } = options;
    const { piece } = moveInfo;

    const selectedPieceBoardState = selectPiece(chessBoardState, { ...options, piece });

    setColorToPlay(chess.board.colorToPlay);
    if (broadcastMove) broadcastMove(moveInfo, promotionPiece);

    return { ...selectedPieceBoardState, lastMove: moveInfo };
};
