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

type MoveDirection = [number, number];
class SlidingPiece extends Piece {
    constructor(directions: MoveDirection[], ...args: ConstructorParameters<typeof Piece>) {
        super(...args);
        this.directions = directions;
    }
    directions: MoveDirection[];

    getValidMoves(board: Board) {
        const moves: Move[] = [];

        for (const direction of this.directions) {
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

class JumpingPiece extends Piece {
    constructor(directions: MoveDirection[], ...args: ConstructorParameters<typeof Piece>) {
        super(...args);
        this.directions = directions;
    }
    directions: MoveDirection[];

    getValidMoves(board: Board) {
        const moves: Move[] = [];

        for (const direction of this.directions) {
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

class Bishop extends SlidingPiece {
    constructor(color: Color, position: Position) {
        super(Bishop.directions, color, position, 3, "Bishop");
    }
    static directions: MoveDirection[] = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
    ];
}

class Knight extends JumpingPiece {
    constructor(color: Color, position: Position) {
        super(Knight.directions, color, position, 3, "Knight");
    }
    static directions: MoveDirection[] = [
        [-1, 2],
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
    ];
}

class Rook extends SlidingPiece {
    constructor(color: Color, position: Position) {
        super(Rook.directions, color, position, 5, "Rook");
    }
    static directions: MoveDirection[] = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
}

class Queen extends SlidingPiece {
    constructor(color: Color, position: Position) {
        super(Queen.directions, color, position, 9, "Queen");
    }
    static directions: MoveDirection[] = [...Bishop.directions, ...Rook.directions];
}

class King extends JumpingPiece {
    constructor(color: Color, position: Position) {
        super(King.directions, color, position, 0, "King");
    }
    static directions: MoveDirection[] = [...Queen.directions];
}

export const Pieces = {
    Pawn,
    Bishop,
    Knight,
    Rook,
    Queen,
    King,
};
