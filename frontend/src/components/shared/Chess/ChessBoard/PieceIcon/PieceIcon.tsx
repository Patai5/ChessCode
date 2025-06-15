import { Color, Piece, PiecesTypes } from "../ChessLogic/pieces";
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

type Props = { piece: Piece };

export default function PieceIcon(props: Props) {
    const { type, color } = props.piece;

    const PieceSVG = pieces[type];

    return <PieceSVG isWhite={color === Color.White} />;
}
