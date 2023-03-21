import { Position, Move } from "./board";

export enum Color {
    White,
    Black,
}

export class Piece {
    constructor(color: Color, position: Position, value: number) {
        this.color = color;
        this.position = position;
        this.value = value;
    }
    color: Color;
    value: number;
    position: Position;
}

class Pawn extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 1);
    }

    // getValidMoves(board: Board): Move[] {}
}

class Bishop extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 3);
    }
}

class Knight extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 3);
    }
}

class Rook extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 5);
    }
}

class Queen extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 9);
    }
}

class King extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 0);
    }
}

export const Pieces = {
    Pawn,
    Bishop,
    Knight,
    Rook,
    Queen,
    King,
};
