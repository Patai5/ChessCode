import { Piece } from "./pieces";

export class Move {
    constructor(from: Position, to: Position) {
        this.from = from.copy();
        this.to = to.copy();
    }
    from: Position;
    to: Position;
}

export class Board {
    constructor() {
        this.board = new Array(64).fill(null);
    }
    board: (Piece | null)[];

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

    move = (move: Move) => {
        const pieceFrom = this.getPiece(move.from);
        if (pieceFrom) {
            pieceFrom.position = move.to;
            this.setPiece(pieceFrom);
        }
        this.setPosition(move.from, null);
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
}
