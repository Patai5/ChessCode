/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { EmotionJSX } from "@emotion/react/dist/declarations/src/jsx-namespace";
import React from "react";
import { ChessBoardStateHandlersProps } from "../useChessBoardState/useChessBoardState";
import { Position } from "./ChessLogic/board";
import { Color } from "./ChessLogic/pieces";
import { isPositionInMoves } from "./ChessLogic/utils";
import Square, { Props as squareProps } from "./Square/Square";

const ChessBoardCss = css`
    display: flex;
    flex-direction: row;
`;
const FileCss = css`
    display: flex;
    flex-flow: column-reverse;
`;

type Props = {
    color: Color;
    chessBoardStateHandlers: ChessBoardStateHandlersProps;
};

export default function ChessBoard(props: Props) {
    const { color, chessBoardStateHandlers } = props;
    const {
        chess,
        chessBoardState,
        handleMaybeGetPromotionPiece,
        handleSelectPiece,
        handleHoveringOver,
        handleMovedTo,
        handleSetPromotionPiece,
    } = chessBoardStateHandlers;

    const { selectedPiece, hoveringOverSquare, lastMove } = chessBoardState;

    const makeSquare = (position: Position): React.ReactElement<squareProps> => {
        const isSelected = !!selectedPiece?.position.equals(position);
        const isHoveringOver = !!hoveringOverSquare?.equals(position);

        const move = lastMove?.move;
        const isLastMove = [move?.from, move?.to].some((movePosition) => movePosition?.equals(position));

        const promotionPiece = handleMaybeGetPromotionPiece(position);
        const piece = promotionPiece ? new promotionPiece(color, position) : chess.board.getPiece(position);

        return (
            <Square
                piece={piece}
                position={position.copy()}
                color={(position.file + position.rank) % 2 === 0 ? Color.Black : Color.White}
                isSelected={isSelected}
                isValidMove={isPositionInMoves(position, chessBoardState.validMoves)}
                isLastMove={isLastMove}
                setSelectedPiece={handleSelectPiece}
                hoveringOver={isHoveringOver}
                setHoveringOver={handleHoveringOver}
                setMovedTo={handleMovedTo}
                isPromotionSquare={!!promotionPiece}
                setPromotionPiece={handleSetPromotionPiece}
                key={position.rank}
            />
        );
    };

    const makeRow = (file: number): React.ReactElement<squareProps>[] => {
        const squares = Array.from({ length: 8 }, (_, rank) => rank).map((rank) => {
            const position = new Position(file, rank);
            return makeSquare(position);
        });
        if (color === Color.Black) squares.reverse();

        return squares;
    };

    const makeFiles = (): EmotionJSX.Element[] => {
        const files = Array.from({ length: 8 }, (_, file) => file).map((file) => (
            <div css={FileCss} key={file}>
                {makeRow(file)}
            </div>
        ));
        if (color === Color.Black) files.reverse();

        return files;
    };

    return <div css={ChessBoardCss}>{makeFiles()}</div>;
}
