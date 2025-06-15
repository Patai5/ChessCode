import { Move, MoveInfo, Position } from "../ChessBoard/ChessLogic/board";
import Chess from "../ChessBoard/ChessLogic/chess";
import { Color, PromotionPieceType } from "../ChessBoard/ChessLogic/pieces";
import { shouldShowPromotion } from "./handlePromotions";
import { selectPiece, SelectPieceOptions } from "./handleSelectPiece";
import { ChessBoardState } from "./useChessBoardState";

export type MoveOptions = Omit<SelectPieceOptions, "piece"> & {
    chess: Chess;
    setColorToPlay: (color: Color) => void;
    promotionPiece?: PromotionPieceType | null;
    broadcastMove?: (moveInfo: MoveInfo, promotionPiece?: PromotionPieceType | null) => void;
};

export const handleMoveTo = (
    chessBoardState: ChessBoardState,
    options: MoveOptions & { moveTo: Position },
): ChessBoardState => {
    const { moveTo } = options;
    const { selectedPiece } = chessBoardState;

    if (!selectedPiece) throw new Error("No piece selected to move");

    const move = new Move(selectedPiece.position, moveTo);
    const showPromotion = shouldShowPromotion(selectedPiece, move);

    if (showPromotion) return { ...chessBoardState, inProgressPromotionMove: move };

    return makeMove(chessBoardState, { ...options, move }).chessBoardState;
};

export const makeMove = (
    chessBoardState: ChessBoardState,
    options: MoveOptions & { move: Move },
): { moveInfo: MoveInfo; chessBoardState: ChessBoardState } => {
    const { move, chess, promotionPiece, setColorToPlay, broadcastMove } = options;

    const moveInfo = chess.move(move, promotionPiece);
    const { piece } = moveInfo;
    const selectedPieceBoardState = selectPiece(chessBoardState, { ...options, piece });

    setColorToPlay(chess.board.colorToPlay);
    if (broadcastMove) broadcastMove(moveInfo, promotionPiece);

    const updatedBoardState = { ...selectedPieceBoardState, lastMove: moveInfo };
    return { moveInfo, chessBoardState: updatedBoardState };
};
