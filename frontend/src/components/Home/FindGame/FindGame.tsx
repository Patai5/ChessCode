/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import TimeControlPicker from "./TimeControlPicker/TimeControlPicker";
import PlayAgainstPicker from "./PlayAgainstPicker/PlayAgainstPicker";
import Paper from "components/shared/Paper";

const findGameCss = css`
    background: linear-gradient(#05586d, #520476);
    display: flex;
    width: 25em;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    padding: 1em;
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    border-radius: 15px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
const titleCss = css`
    font-family: "Lexend Deca", sans-serif;
    font-size: 2.15em;
    font-weight: 500;
    font-style: underline;
    text-decoration-line: underline;
    padding: 0;
    margin: 0;
`;

const mainPaperCss = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.9em;
`;

type Props = {};
export default function FindGame(props: Props) {
    return (
        <div css={findGameCss}>
            <h1 css={titleCss}>Find A Game</h1>
            <Paper customCss={mainPaperCss}>
                <PlayAgainstPicker />
                <TimeControlPicker />
            </Paper>
        </div>
    );
}
