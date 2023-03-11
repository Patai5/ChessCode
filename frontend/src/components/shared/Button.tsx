/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";

type Props = { label: string; onClick?: () => void; color?: string; fontSize?: string };
export default function Button(props: Props) {
    const { color = "#ffffff26", onClick = () => {}, fontSize = "1em" } = props;

    const buttonCss = css`
        background: ${color};
        border-radius: 2em;
        padding: 0.5em 3.1em;
        border: none;
        cursor: pointer;

        transition: all 0.5s ease;
        transition-property: background-position, box-shadow;

        :hover {
            box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
        }
    `;
    const labelCss = css`
        color: #ffffff;
        font-family: "Lexend Deca", sans-serif;
        font-size: ${fontSize};
        margin: 0;
    `;

    return (
        <span css={buttonCss} onClick={onClick}>
            <p css={labelCss}>{props.label}</p>
        </span>
    );
}
