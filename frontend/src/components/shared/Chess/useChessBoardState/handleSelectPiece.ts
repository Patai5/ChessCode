import Chess from "../ChessBoard/ChessLogic/chess";
import { Color, Piece } from "../ChessBoard/ChessLogic/pieces";
import { ChessBoardState } from "./useChessBoardState";

export type SelectPieceOptions = {
    chess: Chess;
    isEnabled: boolean;
    piece: Piece | null;
    color: Color;
};

export const selectPiece = (chessBoardState: ChessBoardState, options: SelectPieceOptions): ChessBoardState => {
    const { chess, piece } = options;

    if (!shouldUpdateSelectedPiece(options)) return chessBoardState;

    return {
        ...chessBoardState,
        selectedPiece: piece,
        validMoves: piece ? piece.getValidMoves(chess.board) : [],
    };
};

const shouldUpdateSelectedPiece = (options: SelectPieceOptions): boolean => {
    const { isEnabled, piece, color } = options;

    if (!isEnabled) return false;

    const isColorToPlay = piece?.color === color;
    return isColorToPlay;
};
