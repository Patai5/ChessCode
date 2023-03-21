import { Board, Position } from "./board";
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
