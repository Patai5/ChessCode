import { Piece, Pieces, Color } from "./pieces";

export class Move {
    constructor(from: Position, to: Position) {
        this.from = from.copy();
        this.to = to.copy();
    }
    from: Position;
    to: Position;
}

export class MoveInfo {
    constructor(move: Move, piece: Piece, capturedPiece: Piece | null = null, isCastle: boolean = false) {
        this.move = move;
        this.piece = piece;
        this.capturedPiece = capturedPiece;
        this.isCastle = isCastle;
    }
    move: Move;
    piece: Piece;
    capturedPiece: Piece | null;
    isCastle: boolean;
}

type KingType = InstanceType<typeof Pieces.King>;
export class Board {
    constructor(pieces: Piece[]) {
        this.board = new Array(64).fill(null);
        this.colorToPlay = Color.White;
        this.moves = [];

        let whiteKing: KingType | null = null;
        let blackKing: KingType | null = null;
        for (const piece of pieces) {
            if (piece instanceof Pieces.King)
                if (piece.color === Color.White) whiteKing = piece;
                else blackKing = piece;

            this.setPiece(piece);
        }

        if (!whiteKing || !blackKing) throw Error("Board must have kings of both colors");
        this.kings = { [Color.White]: whiteKing, [Color.Black]: blackKing };
    }
    board: (Piece | null)[];
    colorToPlay: Color;
    moves: MoveInfo[];
    kings: Record<Color, KingType>;

    setPiece = (piece: Piece) => {
        this.setPosition(piece.position, piece);
    };

    getPiece = (position: Position): Piece | null => {
        if (position.isInvalid()) return null;
        return this.getPosition(position);
    };

    getPosition = (position: Position): Piece | null => {
        return this.board[position.rank * 8 + position.file];
    };

    setPosition = (position: Position, piece: Piece | null) => {
        this.board[position.rank * 8 + position.file] = piece;
    };

    handleEnPassant = (capturingPiece: Piece, move: Move): Piece | null => {
        if (!(capturingPiece instanceof Pieces.Pawn)) return null;

        const enPassantPosition = this.getEnPassantCapturePosition();
        if (!enPassantPosition || !enPassantPosition.equals(move.to)) return null;

        const capturePiece = this.getEnPassantCapturePiece();
        if (!capturePiece) return null;
        this.setPosition(capturePiece.position, null);

        return capturePiece;
    };

    move = (move: Move): MoveInfo => {
        const pieceFrom = this.getPiece(move.from);
        if (!pieceFrom) throw new Error("No piece at from position");

        let capturePiece = this.handleEnPassant(pieceFrom, move);
        if (!capturePiece) capturePiece = this.getPiece(move.to);

        // Removes the piece from the start position and places it at the end position
        pieceFrom.position = move.to;
        this.setPiece(pieceFrom);
        this.setPosition(move.from, null);

        const moveInfo = new MoveInfo(move, pieceFrom, capturePiece);
        this.moves.push(moveInfo);

        this.switchColorToPlay();

        return moveInfo;
    };

    getLastMove = (): Move | null => {
        if (this.moves.length === 0) return null;
        return this.moves[this.moves.length - 1].move;
    };

    switchColorToPlay = () => {
        this.colorToPlay = this.colorToPlay === Color.White ? Color.Black : Color.White;
    };

    getAttackedSquares = (color: Color): Position[] => {
        const attackedSquares: Map<PositionName, Position | NonLegalPosition> = new Map();
        this.board.forEach((piece) => {
            if (!piece || piece.color !== color) return;
            piece.getAttackedSquares(this).forEach((position) => {
                attackedSquares.set(position.toName(), position);
            });
        });
        return Array.from(attackedSquares.values());
    };

    /** Returns a Position object of where the en passant capture should take place.
     *  Returns null when there was no en passant. */
    getEnPassantCapturePosition = (): Position | null => {
        const lastMove = this.getLastMove();
        if (!lastMove) return null;

        const lastPiece = this.getPiece(lastMove.to);
        if (!lastPiece) return null;
        if (!(lastPiece instanceof Pieces.Pawn)) return null;
        if (Math.abs(lastMove.from.rank - lastMove.to.rank) !== 2) return null;

        const capturePosition = lastMove.from.copy();
        capturePosition.rank = lastMove.from.rank + (lastMove.to.rank - lastMove.from.rank) / 2;
        return capturePosition;
    };

    /** Returns a Piece object of the piece that will be captured in the en passant.
     *  Returns null when there was no en passant. */
    getEnPassantCapturePiece = (): Piece | null => {
        const enPassantPosition = this.getEnPassantCapturePosition();
        if (!enPassantPosition) return null;

        const moveDirection = this.colorToPlay === Color.White ? -1 : 1;
        enPassantPosition.rank += moveDirection;

        return this.getPiece(enPassantPosition);
    };

    undoMove = () => {
        const lastMove = this.moves.pop();
        if (!lastMove) return;

        this.setPosition(lastMove.move.to, lastMove.capturedPiece);

        lastMove.piece.position = lastMove.move.from;
        this.setPiece(lastMove.piece);

        this.switchColorToPlay();
    };

    testMoveCheck = (move: Move): boolean => {
        const king = this.kings[this.colorToPlay];
        this.move(move);

        let isCheck = false;
        for (const attackedPosition of this.getAttackedSquares(this.colorToPlay)) {
            if (attackedPosition.equals(king.position)) isCheck = true;
        }

        this.undoMove();
        return isCheck;
    };
}

export type PositionName = string;

export class Position {
    constructor(file: number, rank: number) {
        this.file = file;
        this.rank = rank;
    }
    file: number;
    rank: number;

    static fromName = (name: PositionName): Position => {
        if (name.length !== 2) throw new Error("Invalid position name length");
        const [file, rank] = [name[0], name[1]];
        if (file < "a" || file > "h") throw new Error("Invalid position file");
        if (rank < "1" || rank > "8") throw new Error("Invalid position rank");

        return new Position(file.charCodeAt(0) - "a".charCodeAt(0), rank.charCodeAt(0) - "1".charCodeAt(0));
    };

    toName = (): PositionName => {
        return (String.fromCharCode(this.file + "a".charCodeAt(0)) +
            String.fromCharCode(this.rank + "1".charCodeAt(0))) as PositionName;
    };

    equals = (position: Position): boolean => {
        return this.file === position.file && this.rank === position.rank;
    };

    copy = (): Position => {
        return new Position(this.file, this.rank);
    };

    isInvalid = (): boolean => {
        return this.file < 0 || this.file > 7 || this.rank < 0 || this.rank > 7;
    };

    isInArray = (positions: Position[]): boolean => {
        return positions.some((position) => this.equals(position));
    };
}

export class NonLegalPosition extends Position {
    constructor(file: number, rank: number) {
        super(file, rank);
    }
}
