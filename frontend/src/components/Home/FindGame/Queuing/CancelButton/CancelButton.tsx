/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";

const cancelButtonCss = css`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2em;
    padding: 0.5em 3.1em;
    cursor: pointer;
    border: none;
`;
const textCss = css`
    font-family: "Lexend Deca";
    color: #ffffff;
    font-size: 1.6em;
    margin: 0;
`;

type Props = { stopQueuing: () => void };
export default function CancelButton(props: Props) {
    return (
        <div css={cancelButtonCss} onClick={props.stopQueuing}>
            <p css={textCss}>Cancel</p>
        </div>
    );
}
