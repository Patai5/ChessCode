/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import CSS from "csstype";
import { Piece, Color } from "../ChessLogic/pieces";
import useMousePosition from "hooks/useMousePosition";
import { setPieceType } from "../ChessBoard";
import { Position } from "../ChessLogic/board";

const SquareCss = css`
    width: 3.5em;
    height: 3.5em;
`;

const PieceCss = css`
    width: 100%;
    height: 100%;
    color: darkgreen;

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

const WhiteColorCss = css`
    background-color: white;
`;
const BlackColorCss = css`
    background-color: black;
`;

type Props = {
    piece: Piece | null;
    position: Position;
    color: Color;
    isSelected: boolean;
    setSelectedPiece: setPieceType;
    hoveringOver: boolean;
    setHoveringOver: (position: Position | null) => void;
};
export default function Square(props: Props) {
    const [hoveringState, setHoveringState] = React.useState(false);
    const { clientX, clientY, updatePosition } = useMousePosition(!props.isSelected);

    /** Sets the piece as the selected and hovering piece */
    const handleMouseDown = (e: React.MouseEvent) => {
        updatePosition(e);
        setHoveringState(true);
        props.setSelectedPiece(props.piece);
        document.addEventListener("mouseup", handleHoveringStop, { once: true });
    };
    const handleHoveringStop = () => {
        setHoveringState(false);
        props.setSelectedPiece(null);
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
                SquareCss,
                props.color === Color.White ? WhiteColorCss : BlackColorCss,
                props.hoveringOver && hoveringOverCss,
            ]}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        >
            <div
                onMouseDown={handleMouseDown}
                css={[PieceCss, props.isSelected && selectedPieceCss]}
                style={hoveringState ? hoveringPieceCss : {}}
            >
                {props.piece && props.piece.name}
            </div>
        </div>
    );
}
