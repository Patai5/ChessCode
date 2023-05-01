/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";

const TooltipCss = css`
    position: absolute;
    bottom: 123%;
    left: 50%;
    translate: -50% 0%;
    inline-size: max-content;
    max-width: 12em;
    padding: 0.25em 0.5em 0.25em 0.5em;
    z-index: 999;

    background-color: #000000;
    border-radius: 0.2em;
    color: #ffffff;
    opacity: 0.975;

    transition: all 0.25s ease;
    transition-delay: 0.5s;
    transition-property: bottom, opacity;

    font-family: "Lexend Deca", sans-serif;
    font-size: 0.75em;
    text-align: center;

    ::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -0.5em;
        border-width: 0.5em;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }
    pointer-events: none;
`;
const HiddenCss = css`
    transition-delay: 0s;
    opacity: 0;
    bottom: 130%;
`;

type Props = { text: string; show: boolean };
export default function Tooltip(props: Props) {
    return <div css={[TooltipCss, !props.show && HiddenCss]}>{props.text}</div>;
}
