/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { Piece, Color } from "../ChessLogic/pieces";
import useMousePosition from "hooks/useMousePosition";

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

    :hover {
        color: red;
    }
`;
const WhiteColorCss = css`
    background-color: white;
`;
const BlackColorCss = css`
    background-color: black;
`;

type Props = {
    piece: Piece | null;
    color: Color;
    isSelected: boolean;
    setSelectedPiece: (piece: Piece | null) => void;
};
export default function Square(props: Props) {
    const handleSetSelectPiece = () => {
        if (props.isSelected) {
            props.setSelectedPiece(null);
        } else {
            props.setSelectedPiece(props.piece);
        }
    };

    let selectedPieceCss = null;
    if (props.isSelected) {
        const { clientX, clientY } = useMousePosition();
        selectedPieceCss = css`
            position: fixed;
            color: yellow;
            pointer-events: none;
            left: ${clientX};
            top: ${clientY};
            transform: translate(-50%, -50%);
        `;
    }

    return (
        <div css={[SquareCss, props.color === Color.White ? WhiteColorCss : BlackColorCss]}>
            <div onClick={handleSetSelectPiece} css={[PieceCss, props.isSelected && selectedPieceCss]}>
                {props.piece && props.piece.name}
            </div>
        </div>
    );
}
