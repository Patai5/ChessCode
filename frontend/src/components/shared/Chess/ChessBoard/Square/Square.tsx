/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { SerializedStyles } from "@emotion/serialize";
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
const pieceCss = css`
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
`;

interface SquareCss {
    background: SerializedStyles;
    hoveringOver: SerializedStyles;
    validMove: SerializedStyles;
    promotionSelect: SerializedStyles;
    lastMove: SerializedStyles;
}

const lightSquareCss: SquareCss = {
    background: css`
        background-color: rgb(240, 217, 181);
    `,
    hoveringOver: css`
        box-shadow: none;
        background-color: rgb(255, 193, 101);
    `,
    validMove: css`
        background-color: rgb(240, 217, 181);
        box-shadow: 0px 0px 0.5em 0.2em rgb(255, 188, 83) inset;
    `,
    promotionSelect: css`
        background-color: rgb(255, 101, 101);
    `,
    lastMove: css`
        background-color: rgb(255, 193, 101);
    `,
};
const darkSquareCss: SquareCss = {
    background: css`
        background-color: rgb(181, 136, 99);
    `,
    hoveringOver: css`
        box-shadow: none;
        background-color: rgb(207, 135, 62);
    `,
    validMove: css`
        background-color: rgb(181, 136, 99);
        box-shadow: 0px 0px 0.5em 0.2em rgb(255, 156, 40) inset;
    `,
    promotionSelect: css`
        background-color: rgb(207, 62, 62);
    `,
    lastMove: css`
        background-color: rgb(207, 135, 62);
    `,
};

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

    const handleMouseOver = () => {
        props.setHoveringOver(props.position);
    };
    const handleMouseLeave = () => {
        props.setHoveringOver(null);
    };

    const squareStyles = props.color === Color.White ? lightSquareCss : darkSquareCss;

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
                squareStyles.background,
                props.isLastMove && squareStyles.lastMove,
                props.isValidMove && squareStyles.validMove,
                props.hoveringOver && squareStyles.hoveringOver,
                props.promotionPiece && squareStyles.promotionSelect,
            ]}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div css={pieceCss} style={props.isSelected ? hoveringPieceCss : {}}>
                {(props.promotionPiece && <PieceIcon pieceColorType={props.promotionPiece} />) ||
                    (props.piece && <PieceIcon piece={props.piece} />)}
            </div>
        </div>
    );
}
