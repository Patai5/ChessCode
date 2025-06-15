/** @jsxImportSource @emotion/react */
import { Properties } from "csstype";
import useMousePosition from "hooks/useMousePosition";
import React from "react";
import { Position } from "../ChessLogic/board";
import { Color, Piece } from "../ChessLogic/pieces";
import PieceIcon from "../PieceIcon/PieceIcon";
import { CSS } from "./css";

export type ChessSquareState = {
    piece: Piece | null;
    position: Position;
    color: Color;
    isSelected: boolean;
    isValidMove: boolean;
    isLastMove: boolean;
    hoveringOver: boolean;
    isPromotionSquare: boolean;
};

export type Props = ChessSquareState & {
    setSelectedPiece: (piece: Piece | null) => void;
    setHoveringOver: (position: Position | null) => void;
    setMovedTo: (position: Position) => void;
    setPromotionPiece: (selectedPosition: Position | null) => void;
};
export type AnyProps = Partial<Pick<ChessSquareState, keyof ChessSquareState>>;

export default function Square(props: Props) {
    const {
        piece,
        position,
        color,
        isSelected,
        isValidMove,
        isLastMove,
        hoveringOver,
        isPromotionSquare,
        setSelectedPiece,
        setHoveringOver,
        setMovedTo,
        setPromotionPiece,
    } = props;

    const { clientX, clientY, updatePosition } = useMousePosition(!isSelected);

    const handleHoveringStop = () => {
        setSelectedPiece(null);
    };

    /** Sets the piece as the selected and hovering piece */
    const handleMouseDown = (e: React.MouseEvent) => {
        setPromotionPiece(position);

        updatePosition(e);
        setSelectedPiece(piece);
        document.addEventListener("mouseup", handleHoveringStop, { once: true });
    };

    const handleMouseUp = () => {
        if (isValidMove) setMovedTo(position);
    };

    const handleMouseOver = () => {
        setHoveringOver(position);
    };

    const handleMouseLeave = () => {
        setHoveringOver(null);
    };

    // Can't use emotion's css prop because of performance issues with adding new style to the Head on every mouse move
    const selectedPieceCss: Properties = {
        left: `${clientX}px`,
        top: `${clientY}px`,
    };

    const squareCssTheme = color === Color.White ? CSS.LIGHT_SQUARE : CSS.DARK_SQUARE;
    const squareCss = [
        CSS.SQUARE,
        squareCssTheme.BACKGROUND,
        isLastMove && squareCssTheme.LAST_MOVE,
        isValidMove && squareCssTheme.VALID_MOVE,
        hoveringOver && squareCssTheme.HOVERING_OVER,
        isPromotionSquare && squareCssTheme.PROMOTION_SELECT,
    ];

    const pieceCss = [CSS.PIECE, isSelected && CSS.SELECTED_PIECE];

    return (
        <div
            css={squareCss}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            data-testid={`square-${position.rank}-${position.file} piece-${piece?.type || "empty"}`}
        >
            <div css={pieceCss} style={isSelected ? selectedPieceCss : {}}>
                {piece && <PieceIcon piece={piece} />}
            </div>
        </div>
    );
}
