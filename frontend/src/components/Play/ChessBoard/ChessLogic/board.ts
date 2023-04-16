import { Piece, Pieces, Color, PromotionPiecesShort, PromotionPieceType } from "./pieces";
import { isPositionInPositions } from "./utils";

export type MoveName = string;
export class Move {
    constructor(from: Position, to: Position) {
        this.from = from.copy();
        this.to = to.copy();
    }
    from: Position;
    to: Position;

    static fromName = (moveName: MoveName): { move: Move; promotionPiece: PromotionPieceType | null } => {
        const from = Position.fromName(moveName.slice(0, 2));
        const to = Position.fromName(moveName.slice(2, 4));
        const promotionPiece = moveName[4]
            ? PromotionPiecesShort[moveName[4] as keyof typeof PromotionPiecesShort]
            : null;
        return { move: new Move(from, to), promotionPiece: promotionPiece };
    };
}

export class MoveInfo {
    constructor(
        move: Move,
        piece: Piece,
        capturedPiece: Piece | null = null,
        castleSide: CastleSide | null,
        castlingRights: CastlingRights,
        promotionPiece: InstanceType<PromotionPieceType> | null = null
    ) {
        this.move = move;
        this.piece = piece;
        this.capturedPiece = capturedPiece;
        this.castleSide = castleSide;
        this.castlingRights = castlingRights;
        this.promotionPiece = promotionPiece;
    }
    move: Move;
    piece: Piece;
    capturedPiece: Piece | null;
    castleSide: CastleSide | null = null;
    castlingRights: CastlingRights;
    promotionPiece: InstanceType<PromotionPieceType> | null = null;

    toName = (): MoveName => {
        const promotion = this.promotionPiece ? this.promotionPiece.typeShort : "";
        return `${this.move.from.toName()}${this.move.to.toName()}${promotion}`;
    };
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
        this.castlingRights = new CastlingRights();
    }
    board: (Piece | null)[];
    colorToPlay: Color;
    moves: MoveInfo[];
    kings: Record<Color, KingType>;
    castlingRights: CastlingRights;

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

    updateCastlingRights = (pieceFrom: Piece, capturedPiece: Piece | null) => {
        if (pieceFrom instanceof Pieces.King) {
            this.castlingRights[pieceFrom.color][CastleSide.King] = false;
            this.castlingRights[pieceFrom.color][CastleSide.Queen] = false;
            return;
        }
        let updateRook: InstanceType<typeof Pieces.Rook> | null = null;
        if (capturedPiece instanceof Pieces.Rook) updateRook = capturedPiece;
        else if (pieceFrom instanceof Pieces.Rook) updateRook = pieceFrom;
        else return;

        // Rook must be on the original rank
        if (updateRook.color === Color.White && updateRook.position.rank !== 0) return;
        if (updateRook.color === Color.Black && updateRook.position.rank !== 7) return;

        const updateQueen =
            updateRook.position.file === CastlingFiles[CastleSide.Queen].rookFrom ? CastleSide.Queen : null;
        const updateKing =
            updateRook.position.file === CastlingFiles[CastleSide.King].rookFrom ? CastleSide.King : null;
        if (!updateQueen && !updateKing) return;

        this.castlingRights[updateRook.color][(updateQueen || updateKing) as CastleSide.Queen | CastleSide.King] =
            false;
    };

    handleCastling = (pieceFrom: Piece, capturedPiece: Piece | null, move: Move): CastleSide | null => {
        this.updateCastlingRights(pieceFrom, capturedPiece);

        if (!(pieceFrom instanceof Pieces.King)) return null;
        if (Math.abs(move.from.file - move.to.file) !== 2) return null;

        const castleSide = move.from.file < move.to.file ? CastleSide.King : CastleSide.Queen;

        const rookPosition = move.from.copy();
        rookPosition.file = CastlingFiles[castleSide].rookFrom;
        const rook = this.getPiece(rookPosition)!;

        this.setPosition(rook.position, null);
        rook.position.file = CastlingFiles[castleSide].rookTo;
        this.setPiece(rook);

        return castleSide;
    };

    handlePawnPromotion = (pieceFrom: Piece, move: Move, promotionPiece: PromotionPieceType | null) => {
        if (!promotionPiece) return;

        const promotedPiece = new promotionPiece(pieceFrom.color, move.to);
        this.setPiece(promotedPiece);
        return promotedPiece;
    };

    move = (move: Move, promotionPiece: PromotionPieceType | null = null): MoveInfo => {
        const pieceFrom = this.getPiece(move.from);
        if (!pieceFrom) throw new Error("No piece at from position");

        let capturePiece = this.handleEnPassant(pieceFrom, move);
        if (!capturePiece) capturePiece = this.getPiece(move.to);

        const catlingRights = this.castlingRights.copy();
        const CastleSide = this.handleCastling(pieceFrom, capturePiece, move);

        // Removes the piece from the start position and places it at the end position
        pieceFrom.position = move.to;
        this.setPiece(pieceFrom);
        this.setPosition(move.from, null);

        const promotedPiece = this.handlePawnPromotion(pieceFrom, move, promotionPiece);

        const moveInfo = new MoveInfo(move, pieceFrom, capturePiece, CastleSide, catlingRights, promotedPiece);
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

    handleUndoCastling = (lastMove: MoveInfo) => {
        this.castlingRights = lastMove.castlingRights;
        if (!lastMove.castleSide) return;

        const rookPosition = lastMove.piece.position.copy();
        const rookPositionTo = lastMove.piece.position.copy();
        rookPosition.file = CastlingFiles[lastMove.castleSide].rookFrom;
        rookPositionTo.file = CastlingFiles[lastMove.castleSide].rookTo;

        const rook = this.getPiece(rookPosition)!;
        this.setPosition(rookPosition, null);

        rook.position = rookPositionTo;
        this.setPiece(rook);
    };

    undoMove = () => {
        const lastMove = this.moves.pop();
        if (!lastMove) return;

        this.handleUndoCastling(lastMove);

        this.setPosition(lastMove.move.to, lastMove.capturedPiece);

        lastMove.piece.position = lastMove.move.from;
        this.setPiece(lastMove.piece);

        this.switchColorToPlay();
    };

    testMoveCheck = (move: Move): boolean => {
        const king = this.kings[this.colorToPlay];
        this.move(move);

        let isCheck = isPositionInPositions(king.position, this.getAttackedSquares(this.colorToPlay));

        this.undoMove();
        return isCheck;
    };
}

export enum CastleSide {
    King = "King",
    Queen = "Queen",
}
export const CastlingFiles = {
    [CastleSide.King]: { kingTo: 6, rookFrom: 7, rookTo: 5 },
    [CastleSide.Queen]: { kingTo: 2, rookFrom: 0, rookTo: 3 },
};
class CastlingRights {
    constructor() {
        this[Color.White] = { [CastleSide.King]: true, [CastleSide.Queen]: true };
        this[Color.Black] = { [CastleSide.King]: true, [CastleSide.Queen]: true };
    }
    [Color.White]: { [key in CastleSide]: boolean };
    [Color.Black]: { [key in CastleSide]: boolean };

    copy = (): CastlingRights => {
        const newCastlingRights = new CastlingRights();
        for (const color of Object.values(Color)) {
            for (const side of Object.values(CastleSide)) {
                newCastlingRights[color][side] = this[color][side];
            }
        }
        return newCastlingRights;
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
