import React from "react";
import { Color, Piece, PiecesTypes, PieceColorType } from "../ChessLogic/pieces";
import Bishop from "./Bishop";
import King from "./King";
import Knight from "./Knight";
import Pawn from "./Pawn";
import Queen from "./Queen";
import Rook from "./Rook";

const pieces = {
    [PiecesTypes.Pawn]: Pawn,
    [PiecesTypes.Knight]: Knight,
    [PiecesTypes.Bishop]: Bishop,
    [PiecesTypes.Rook]: Rook,
    [PiecesTypes.Queen]: Queen,
    [PiecesTypes.King]: King,
};

export type PieceIconProps = {
    isWhite: boolean;
};

type Props = {
    piece?: Piece;
    pieceColorType?: PieceColorType;
};
type AnyProps = Partial<Pick<Props, keyof Props>>;
export default function PieceIcon(props: AnyProps) {
    if (props.piece) {
        const PieceSVG = pieces[props.piece.type];
        return <PieceSVG isWhite={props.piece.color === Color.White} />;
    } else if (props.pieceColorType) {
        const PieceSVG = pieces[props.pieceColorType.piece.type];
        return <PieceSVG isWhite={props.pieceColorType.color === Color.White} />;
    } else {
        throw new Error("PieceIcon: No piece or pieceColorType provided");
    }
}
