import { Board, Position, Move } from "./board";
import { Piece, Pieces, Color } from "./pieces";

export const genDefaultBoard = (): Board => {
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

    const pieces: Piece[] = [];
    for (let i = 0; i < 8; i++) {
        pieces.push(new defaultPieceOrder[i](Color.White, new Position(i, 0)));
        pieces.push(new Pieces.Pawn(Color.White, new Position(i, 1)));
        pieces.push(new Pieces.Pawn(Color.Black, new Position(i, 6)));
        pieces.push(new defaultPieceOrder[i](Color.Black, new Position(i, 7)));
    }

    return new Board(pieces);
};

export const isPositionInMoveArray = (position: Position, moveArray: Move[]) => {
    for (const move of moveArray) {
        if (position.equals(move.to)) {
            return true;
        }
    }
    return false;
};
