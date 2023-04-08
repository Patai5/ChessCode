import { Position, NonLegalPosition, Move, Board } from "./board";

export enum Color {
    White = "White",
    Black = "Black",
}

export enum PiecesTypes {
    Pawn = "Pawn",
    Knight = "Knight",
    Bishop = "Bishop",
    Rook = "Rook",
    Queen = "Queen",
    King = "King",
}

export class Piece {
    constructor(color: Color, position: Position, value: number, type: PiecesTypes) {
        this.color = color;
        this.position = position;
        this.value = value;
        this.type = type;
    }
    color: Color;
    value: number;
    position: Position;
    type: PiecesTypes;

    /**
     * Returns a list of valid moves for this piece, given the current board state.
     */
    getValidMoves(board: Board): Move[] {
        return [];
    }

    /**
     * Exclude any moves from the `moves` parameter that would result in the player's king getting checked.
     */
    filterOutCheckMoves = (board: Board, moves: Move[]): Move[] => {
        return moves.filter((move) => !board.testMoveCheck(move));
    };

    move = (move: Move) => {
        this.position = move.to;
    };

    /**
     * Returns a list of squares attacked by this piece, given the current board state.
     * - This can also include non-legal positions to move to. However those are still considered attacked.
     */
    getAttackedSquares(board: Board): (Position | NonLegalPosition)[] {
        return [];
    }
}

class Pawn extends Piece {
    constructor(color: Color, position: Position) {
        super(color, position, 1, PiecesTypes.Pawn);
    }

    getAttackedSquares(board: Board): (Position | NonLegalPosition)[] {
        const attackedSquares: (Position | NonLegalPosition)[] = [];

        const moveDirection = this.color === Color.White ? 1 : -1;

        // Diagonal capture
        const leftCapture = this.position.copy();
        leftCapture.rank += moveDirection;
        leftCapture.file -= 1;

        const rightCapture = this.position.copy();
        rightCapture.rank += moveDirection;
        rightCapture.file += 1;

        for (const position of [leftCapture, rightCapture]) {
            if (position.isInvalid()) continue;
            const piece = board.getPiece(position);
            if (piece && piece.color !== this.color) {
                attackedSquares.push(position);
                continue;
            }
            const enPassantPosition = board.getEnPassantCapturePosition();
            if (enPassantPosition && enPassantPosition.equals(position)) {
                attackedSquares.push(position);
                continue;
            }
            attackedSquares.push(new NonLegalPosition(position.file, position.rank));
        }

        return attackedSquares;
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

        const attackedSquares = this.getAttackedSquares(board);
        attackedSquares
            .filter((square) => square.constructor === Position)
            .forEach((square) => {
                moves.push(new Move(this.position, square));
            });

        return this.filterOutCheckMoves(board, moves);
    }
}

type MoveDirection = [number, number];
class SlidingPiece extends Piece {
    constructor(directions: MoveDirection[], ...args: ConstructorParameters<typeof Piece>) {
        super(...args);
        this.directions = directions;
    }
    directions: MoveDirection[];

    getAttackedSquares(board: Board): (Position | NonLegalPosition)[] {
        const attackedSquares: (Position | NonLegalPosition)[] = [];

        for (const direction of this.directions) {
            const currentPosition = this.position.copy();

            while (true) {
                currentPosition.rank += direction[0];
                currentPosition.file += direction[1];
                const position = currentPosition.copy();

                if (position.isInvalid()) break;

                const piece = board.getPiece(position);
                if (!piece) attackedSquares.push(position);
                else if (piece.color !== this.color) {
                    attackedSquares.push(position);
                    // If the piece is an enemy king, continue so that we can x-ray attack the squares behind it
                    if (piece.type !== PiecesTypes.King) break;
                }
                // Friendly piece found on this square, stop attacking
                else {
                    attackedSquares.push(new NonLegalPosition(position.file, position.rank));
                    break;
                }
            }
        }

        return attackedSquares;
    }

    getValidMoves(board: Board) {
        const moves = this.getAttackedSquares(board)
            .filter((square) => square.constructor === Position)
            .map((square) => new Move(this.position, square));
        return this.filterOutCheckMoves(board, moves);
    }
}

class JumpingPiece extends Piece {
    constructor(directions: MoveDirection[], ...args: ConstructorParameters<typeof Piece>) {
        super(...args);
        this.directions = directions;
    }
    directions: MoveDirection[];

    getAttackedSquares(board: Board): (Position | NonLegalPosition)[] {
        const attackedSquares: (Position | NonLegalPosition)[] = [];

        for (const direction of this.directions) {
            const position = this.position.copy();
            position.rank += direction[0];
            position.file += direction[1];
            if (position.isInvalid()) continue;

            const piece = board.getPiece(position);
            if (piece && piece.color === this.color) {
                attackedSquares.push(new NonLegalPosition(position.file, position.rank));
                continue;
            }
            attackedSquares.push(position);
        }

        return attackedSquares;
    }

    getValidMoves(board: Board) {
        const moves = this.getAttackedSquares(board)
            .filter((square) => square.constructor === Position)
            .map((square) => new Move(this.position, square));
        return this.filterOutCheckMoves(board, moves);
    }
}

class Bishop extends SlidingPiece {
    constructor(color: Color, position: Position) {
        super(Bishop.directions, color, position, 3, PiecesTypes.Bishop);
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
        super(Knight.directions, color, position, 3, PiecesTypes.Knight);
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
        super(Rook.directions, color, position, 5, PiecesTypes.Rook);
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
        super(Queen.directions, color, position, 9, PiecesTypes.Queen);
    }
    static directions: MoveDirection[] = [...Bishop.directions, ...Rook.directions];
}

class King extends JumpingPiece {
    constructor(color: Color, position: Position) {
        super(King.directions, color, position, 0, PiecesTypes.King);
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
