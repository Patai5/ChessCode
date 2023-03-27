/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { Position } from "./ChessLogic/board";
import Chess from "./ChessLogic/chess";
import { Color, Piece } from "./ChessLogic/pieces";
import Square from "./Square/Square";

const ChessBoardCss = css`
    display: flex;
    flex-direction: row;
`;
const FileCss = css`
    display: flex;
    flex-flow: column-reverse;
`;

export type selectedPieceType = Piece | null;
export type setPieceType = (piece: selectedPieceType) => void;

type Props = {};
export default function ChessBoard(props: Props) {
    const [selectedPiece, setSelectedPiece] = React.useState<selectedPieceType>(null);
    const [hoveringOver, setHoveringOver] = React.useState<Position | null>(null);
    const chess = new Chess();

    const handleSelectPiece: setPieceType = (piece: selectedPieceType) => {
        setSelectedPiece(piece);
    };

    /** Packs all of the chessboard into an array of columns containing the rows with individual squares
    @returns {JSX.Element[]} Array of React elements containing the chessboard */
    const MakeFiles = () => {
        const files = [];

        const position = new Position(0, 0);
        // Iterates through all of chessboard files (columns)
        while (position.file < 8) {
            const rows = [];
            // Iterates through all of the chessboard ranks (rows)
            while (position.rank < 8) {
                rows.push(
                    <Square
                        piece={chess.board.getPiece(position)}
                        position={position.copy()}
                        color={(position.file + position.rank) % 2 === 0 ? Color.Black : Color.White}
                        isSelected={selectedPiece ? selectedPiece.position.toName() === position.toName() : false}
                        key={position.rank}
                        setSelectedPiece={handleSelectPiece}
                        hoveringOver={hoveringOver ? hoveringOver.toName() === position.toName() : false}
                        setHoveringOver={setHoveringOver}
                    />
                );
                position.rank++;
            }

            // Adds the finished file to the array of files
            files.push(
                <div css={FileCss} key={position.file}>
                    {rows}
                </div>
            );

            position.rank = 0;
            position.file++;
        }
        return files;
    };

    return <div css={ChessBoardCss}> {MakeFiles()}</div>;
}
