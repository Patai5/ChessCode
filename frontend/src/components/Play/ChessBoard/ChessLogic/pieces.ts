import { Position, Move } from "./board";

export enum Color {
    White,
    Black,
}

export class Piece {
    constructor(color: Color, position: Position, value: number, name: string) {
        this.color = color;
        this.position = position;
        this.value = value;
        this.name = name;
    }
    color: Color;
    value: number;
    position: Position;
    name: string;
}

class Pawn extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 1, "Pawn");
    }

    // getValidMoves(board: Board): Move[] {}
}

class Bishop extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 3, "Bishop");
    }
}

class Knight extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 3, "Knight");
    }
}

class Rook extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 5, "Rook");
    }
}

class Queen extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 9, "Queen");
    }
}

class King extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 0, "King");
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
