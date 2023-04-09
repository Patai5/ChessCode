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

export const isPositionInMoves = (position: Position, moveArray: Move[]) => {
    return isPositionInPositions(
        position,
        moveArray.map((move) => move.to)
    );
};

export const isPositionInPositions = (position: Position, positionArray: Position[]) => {
    for (const pos of positionArray) {
        if (position.equals(pos)) {
            return true;
        }
    }
    return false;
};

export const getOppositeColor = (color: Color) => {
    return color === Color.White ? Color.Black : Color.White;
};
