/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { secToTime } from "utils/utils";
import useKeypress from "utils/useKeypress";
import TimeElapsed from "./TimeElapsed/TimeElapsed";
import Searching from "./Searching/Searching";
import CancelButton from "./CancelButton/CancelButton";
import { handleStopQueuingType } from "../FindGame";

const animationLength = 200;
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
    translate: -50% -50%;
`;
const openAnimationCss = css`
    animation: pop-in ${animationLength}ms ease-in-out forwards;
    @keyframes pop-in {
        0% {
            opacity: 0;
            transform: scale(0);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
const closedAnimationCss = css`
    animation: pop-out ${animationLength}ms ease-in-out forwards;
    @keyframes pop-out {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
const gameInfoCss = css`
    margin: 0;
    font-family: "Lexend Deca";
    font-weight: 700;
    font-size: 1.4em;
`;

type Props = { queue: QueueState; stopQueuing: handleStopQueuingType };
export default function Queuing(props: Props) {
    const [open, setOpen] = React.useState(true);

    const handleCancel = async () => {
        setOpen(false);
        await props.stopQueuing(animationLength);
    };

    useKeypress("Escape", () => handleCancel);

    return (
        <div css={[queuingCss, open ? openAnimationCss : closedAnimationCss]}>
            <Searching />
            <h3 css={gameInfoCss}>
                {props.queue.gameMode} - {secToTime(props.queue.timeControl)}
            </h3>
            <TimeElapsed />
            <CancelButton stopQueuing={handleCancel} />
        </div>
    );
}
