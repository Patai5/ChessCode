/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { secToTime } from "utils/utils";
import TimeElapsed from "./TimeElapsed/TimeElapsed";
import Searching from "./Searching/Searching";
import CancelButton from "./CancelButton/CancelButton";

export interface QueueState {
    gameMode: string;
    timeControl: number;
}
const queuingCss = css`
    color: white;
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    background: rgba(36, 36, 36, 0.97);
    backdrop-filter: blur(0.1em);
    border-radius: 0.5em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.4em 3.85em;
    grid-gap: 0.7em;
    width: 12em;
    height: 12em;

    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;
const gameInfoCss = css`
    margin: 0;
    font-family: "Lexend Deca";
    font-weight: 700;
    font-size: 1.4em;
`;

type Props = { queue: QueueState; stopQueuing: () => void };
export default function Queuing(props: Props) {
    return (
        <div css={queuingCss}>
            <Searching />
            <h3 css={gameInfoCss}>
                {props.queue.gameMode} - {secToTime(props.queue.timeControl)}
            </h3>
            <TimeElapsed />
            <CancelButton stopQueuing={props.stopQueuing} />
        </div>
    );
}
