import { MoveInfo } from "../ChessBoard/ChessLogic/board";
import { Color } from "../ChessBoard/ChessLogic/pieces";
import { selectPiece, SelectPieceOptions } from "./handleSelectPiece";
import { ChessBoardState } from "./useChessBoardState";

type MoveOptions = Omit<SelectPieceOptions, "piece"> & {
    setColorToPlay: (color: Color) => void;
    moveInfo: MoveInfo;
};

/**
 * Modifies the current board react use states to reflect the given move.
 * - Updates the selected piece, color to play, and last move.
 */
export const makeMove = (chessBoardState: ChessBoardState, options: MoveOptions): ChessBoardState => {
    const { moveInfo, chess, setColorToPlay } = options;
    const { piece } = moveInfo;

    const selectedPieceBoardState = selectPiece(chessBoardState, { ...options, piece });

    setColorToPlay(chess.board.colorToPlay);

    return { ...selectedPieceBoardState, lastMove: moveInfo };
};
