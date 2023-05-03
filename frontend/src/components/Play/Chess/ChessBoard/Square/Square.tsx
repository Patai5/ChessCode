/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import CSS from "csstype";
import useMousePosition from "hooks/useMousePosition";
import React from "react";
import { setPieceType } from "../ChessBoard";
import { Position } from "../ChessLogic/board";
import { Color, Piece, PieceColorType } from "../ChessLogic/pieces";
import PieceIcon from "../PieceIcon/PieceIcon";

const squareCss = css`
    width: 3.5em;
    height: 3.5em;
`;
const validMoveSquareCss = css`
    background: pink;
`;

const pieceCss = css`
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
`;

const hoveringOverCss = css`
    background: blue;
`;
const selectedPieceCss = css`
    color: yellow;
`;
const promotionSelectPieceCss = css`
    background: red;
`;

const whiteColorCss = css`
    background-color: rgb(240, 217, 181);
`;
const blackColorCss = css`
    background-color: rgb(181, 136, 99);
`;

const lastMoveWhiteCss = css`
    background-color: rgb(255, 193, 101);
`;
const lastMoveBlackCss = css`
    background-color: rgb(207 135 62);
`;

export type Props = {
    piece: Piece | null;
    position: Position;
    color: Color;
    isSelected: boolean;
    isValidMove: boolean;
    isLastMove: boolean;
    setSelectedPiece: setPieceType;
    hoveringOver: boolean;
    setHoveringOver: (position: Position | null) => void;
    setMovedTo: (position: Position) => void;
    promotionPiece: PieceColorType | null;
    setPromotionPiece: (selectedPosition: Position | null) => void;
};
export type AnyProps = Partial<Pick<Props, keyof Props>>;
export default function Square(props: Props) {
    const { clientX, clientY, updatePosition } = useMousePosition(!props.isSelected);

    const handleHoveringStop = () => {
        props.setSelectedPiece(null);
    };
    /** Sets the piece as the selected and hovering piece */
    const handleMouseDown = (e: React.MouseEvent) => {
        props.setPromotionPiece(props.position);

        updatePosition(e);
        props.setSelectedPiece(props.piece);
        document.addEventListener("mouseup", handleHoveringStop, { once: true });
    };
    const handleMouseUp = () => {
        if (props.isValidMove) props.setMovedTo(props.position);
    };

    const handleMouseOver = (e: React.MouseEvent) => {
        props.setHoveringOver(props.position);
    };
    const handleMouseLeave = (e: React.MouseEvent) => {
        props.setHoveringOver(null);
    };

    // Can't use emotion's css prop because of performance issues with adding new style to the Head on every mouse move
    const hoveringPieceCss: CSS.Properties = {
        position: "fixed",
        pointerEvents: "none",
        left: `${clientX}px`,
        top: `${clientY}px`,
        transform: "translate(-50%, -50%)",
    };

    return (
        <div
            css={[
                squareCss,
                props.color === Color.White ? whiteColorCss : blackColorCss,
                props.hoveringOver && hoveringOverCss,
                props.isValidMove && validMoveSquareCss,
                props.promotionPiece && promotionSelectPieceCss,
                props.isLastMove && (props.color === Color.White ? lastMoveWhiteCss : lastMoveBlackCss),
            ]}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div
                css={[pieceCss, props.isSelected && selectedPieceCss]}
                style={props.isSelected ? hoveringPieceCss : {}}
            >
                {(props.promotionPiece && <PieceIcon pieceColorType={props.promotionPiece} />) ||
                    (props.piece && <PieceIcon piece={props.piece} />)}
            </div>
        </div>
    );
}
