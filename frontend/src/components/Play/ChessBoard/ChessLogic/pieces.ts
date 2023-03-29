import { Position, Move, Board } from "./board";

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

    /**
     * Returns a list of valid moves for this piece, given the current board state.
     */
    getValidMoves(board: Board): Move[] {
        return [];
    }

    move = (move: Move) => {
        this.position = move.to;
    };
}

class Pawn extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 1, "Pawn");
    }

    getValidMoves(board: Board): Move[] {
        const moves: Move[] = [];

        const moveDirection = this.color === Color.White ? 1 : -1;

        // Straight forward
        const forwardPosition = this.position.copy();
        forwardPosition.rank += moveDirection;
        if (!board.getPiece(forwardPosition)) {
            moves.push(new Move(this.position, forwardPosition));

            // First move can be two squares forward
            const isWhiteEligible = this.color === Color.White && this.position.rank === 1;
            const isBlackEligible = this.color === Color.Black && this.position.rank === 6;
            if (isWhiteEligible || isBlackEligible) {
                forwardPosition.rank += moveDirection;
                if (!board.getPiece(forwardPosition)) {
                    moves.push(new Move(this.position, forwardPosition));
                }
            }
        }

        // Diagonal capture
        const leftCapture = this.position.copy();
        leftCapture.rank += moveDirection;
        leftCapture.file -= 1;

        const rigthCapture = this.position.copy();
        rigthCapture.rank += moveDirection;
        rigthCapture.file += 1;

        for (const position of [leftCapture, rigthCapture]) {
            const piece = board.getPiece(position);
            if (piece && piece.color !== this.color) {
                moves.push(new Move(this.position, position));
            }
        }

        return moves;
    }
}

class Bishop extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 3, "Bishop");
    }

    getValidMoves(board: Board): Move[] {
        const moves: Move[] = [];

        const directions = [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ];
        for (const direction of directions) {
            const position = this.position.copy();

            while (true) {
                position.rank += direction[0];
                position.file += direction[1];

                if (position.isInvalid()) break;

                const piece = board.getPiece(position);
                if (piece && piece.color === this.color) break;

                moves.push(new Move(this.position, position));

                if (piece && piece.color !== this.color) break;
            }
        }

        return moves;
    }
}

class Knight extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 3, "Knight");
    }

    getValidMoves(board: Board): Move[] {
        const moves: Move[] = [];

        const directions = [
            [-1, 2],
            [1, 2],
            [2, 1],
            [2, -1],
            [1, -2],
            [-1, -2],
            [-2, -1],
            [-2, 1],
        ];

        for (const direction of directions) {
            const position = this.position.copy();
            position.rank += direction[0];
            position.file += direction[1];

            if (position.isInvalid()) continue;

            const piece = board.getPiece(position);
            if (piece && piece.color === this.color) continue;

            moves.push(new Move(this.position, position));
        }

        return moves;
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
