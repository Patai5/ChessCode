/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
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

    // TODO: Transform this outside of emotion css, it creates a new css every render and doesn't remove the old ones
    const hoveringPieceCss = css`
        position: fixed;
        pointer-events: none;
        left: ${clientX};
        top: ${clientY};
        transform: translate(-50%, -50%);
    `;

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
                css={[PieceCss, props.isSelected && selectedPieceCss, hoveringState && hoveringPieceCss]}
            >
                {props.piece && props.piece.name}
            </div>
        </div>
    );
}
