/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import CSS from "csstype";
import useMousePosition from "hooks/useMousePosition";
import React from "react";
import { setPieceType } from "../ChessBoard";
import { Position } from "../ChessLogic/board";
import { Color, Piece } from "../ChessLogic/pieces";
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

const whiteColorCss = css`
    background-color: rgb(240, 217, 181);
`;
const blackColorCss = css`
    background-color: rgb(181, 136, 99);
`;

export type Props = {
    piece: Piece | null;
    position: Position;
    color: Color;
    isSelected: boolean;
    isValidMove: boolean;
    setSelectedPiece: setPieceType;
    hoveringOver: boolean;
    setHoveringOver: (position: Position | null) => void;
    setMovedTo: (position: Position) => void;
};
export type AnyProps = Partial<Pick<Props, keyof Props>>;
export default function Square(props: Props) {
    const [hoveringState, setHoveringState] = React.useState(false);
    const { clientX, clientY, updatePosition } = useMousePosition(!props.isSelected);

    const handleHoveringStop = () => {
        setHoveringState(false);
        props.setSelectedPiece(null);
    };
    /** Sets the piece as the selected and hovering piece */
    const handleMouseDown = (e: React.MouseEvent) => {
        updatePosition(e);
        setHoveringState(true);
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
            ]}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div css={[pieceCss, props.isSelected && selectedPieceCss]} style={hoveringState ? hoveringPieceCss : {}}>
                {props.piece && <PieceIcon piece={props.piece} />}
            </div>
        </div>
    );
}
