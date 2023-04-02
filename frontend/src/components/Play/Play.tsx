/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import Chessboard from "./ChessBoard/ChessBoard";
import { Color } from "./ChessBoard/ChessLogic/pieces";

type Props = { color: Color };
export default function Play(props: Props) {
    const { color = Color.White } = props;

    return <Chessboard color={color} />;
}
