/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { secToTime } from "utils/utils";
import useKeypress from "utils/useKeypress";
import TimeElapsed from "./TimeElapsed/TimeElapsed";
import Searching from "./Searching/Searching";
import CancelButton from "./CancelButton/CancelButton";

export const animationLength = 200;

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

    transition: transform ${animationLength}ms ease-in-out;
    transition-property: opacity, transform;
    opacity: 0;
    transform: scale(0);
`;
const openAnimationCss = css`
    opacity: 1;
    transform: scale(1);
`;
const closedAnimationCss = css`
    opacity: 0;
    transform: scale(0);
`;
const gameInfoCss = css`
    margin: 0;
    font-family: "Lexend Deca";
    font-weight: 700;
    font-size: 1.4em;
`;

type Props = { queue: QueueState; show: boolean; stopQueuing: () => Promise<void> };
export default function Queuing(props: Props) {
    const [show, setShow] = React.useState(null);

    React.useEffect(() => {
        setShow(props.show);
    }, [props.show]);

    const handleCancel = async () => {
        await props.stopQueuing();
    };

    useKeypress("Escape", handleCancel);

    return (
        <div css={[queuingCss, show === true && openAnimationCss, show === false && closedAnimationCss]}>
            <Searching />
            <h3 css={gameInfoCss}>
                {props.queue.gameMode} - {secToTime(props.queue.timeControl)}
            </h3>
            <TimeElapsed />
            <CancelButton stopQueuing={handleCancel} />
        </div>
    );
}
