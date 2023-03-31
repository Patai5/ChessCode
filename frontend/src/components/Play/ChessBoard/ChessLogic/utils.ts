import { Board, Position, Move } from "./board";
import { Pieces, Color } from "./pieces";

export const genDefaultBoard = (): Board => {
    const board = new Board();

    const defaultPieceOrder = [
        Pieces.Rook,
        Pieces.Knight,
        Pieces.Bishop,
        Pieces.Queen,
        Pieces.King,
        Pieces.Bishop,
        Pieces.Knight,
        Pieces.Rook,
    ];

    for (let i = 0; i < 8; i++) {
        board.setPiece(new defaultPieceOrder[i](Color.White, new Position(i, 0)));
        board.setPiece(new Pieces.Pawn(Color.White, new Position(i, 1)));
        board.setPiece(new Pieces.Pawn(Color.Black, new Position(i, 6)));
        board.setPiece(new defaultPieceOrder[i](Color.Black, new Position(i, 7)));
    }

    return board;
};

export const isPositionInMoveArray = (position: Position, moveArray: Move[]) => {
    for (const move of moveArray) {
        if (position.equals(move.to)) {
            return true;
        }
    }
    return false;
};

/** Returns a Position object of where the en passant capture should take place.
 *  Returns null when there was no en passant. */
export const getEnPassantCapturePosition = (board: Board): Position | null => {
    const lastMove = board.getLastMove();
    if (!lastMove) return null;

    const lastPiece = board.getPiece(lastMove.to);
    if (!lastPiece) return null;
    if (!(lastPiece instanceof Pieces.Pawn)) return null;
    if (Math.abs(lastMove.from.rank - lastMove.to.rank) !== 2) return null;

    const capturePosition = lastMove.from.copy();
    capturePosition.rank = lastMove.from.rank + (lastMove.to.rank - lastMove.from.rank) / 2;
    return capturePosition;
};
