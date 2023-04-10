/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import Chessboard from "./ChessBoard/ChessBoard";
import { Color } from "./ChessBoard/ChessLogic/pieces";

const playCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

type Props = { color?: Color };
export default function Play(props: Props) {
    const { color = Color.White } = props;

    return (
        <div css={playCss}>
            <Chessboard color={color} />
        </div>
    );
}
