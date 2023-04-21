/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { FaClock } from "react-icons/fa";
import Paper from "components/shared/Paper";

const TimerPaperCss = css`
    margin: 0.5em 0 0.5em 0;
    margin-left: auto;
`;
const TimerCss = css`
    display: flex;
    gap: 0.75em;
`;
const TimerItemCss = css`
    font-family: "Roboto Mono", monospace;
    font-weight: bold;
    color: #fff;
    font-size: 1.5em;
`;
const PausedTimerItemCss = css`
    color: #ffffff80;
`;

export type TimeMs = number;
/**
 * Returns the time in the format "mm:ss" from a time in milliseconds
 * If the time is
 */
const timeToString = (time: TimeMs, showTenthsOfSec: boolean = false) => {
    let timeString = "";

    const minutes = Math.floor(time / 60000);
    timeString += minutes.toString() + ":";

    const seconds = Math.floor((time % 60000) / 1000);
    timeString += seconds < 10 ? "0" + seconds : seconds.toString();

    if (showTenthsOfSec) {
        const tenthsOfSec = Math.floor((time % 1000) / 100);
        timeString += "." + tenthsOfSec.toString();
    }
    return timeString;
};

type Props = { time: TimeMs; paused?: boolean };
export default function Play(props: Props) {
    // BUG: When the tab is inactive, the timer will not update
    const [time, setTime] = React.useState(props.time);
    const [disable, setDisable] = React.useState(false);
    const [showTenthsOfSec, setShowTenthsOfSec] = React.useState(false);

    const SHOW_TENTHS_OF_SEC_TIME = 10000;
    const updateTime = () => {
        setTime((time) => {
            if (time <= SHOW_TENTHS_OF_SEC_TIME) setShowTenthsOfSec(true);
            if (time <= 0) {
                setDisable(true);
                return time;
            }
            return time - 100;
        });
    };

    React.useEffect(() => {
        if (props.paused || disable) return;

        const interval = setInterval(updateTime, 100);

        return () => {
            clearInterval(interval);
        };
    }, [props.time, props.paused, disable]);

    const itemsCss = [TimerItemCss, (disable || props.paused) && PausedTimerItemCss];
    return (
        <Paper elevation={1} white={true} customCss={TimerPaperCss}>
            <div css={TimerCss}>
                <FaClock css={itemsCss} />
                <div css={itemsCss}>{timeToString(time, showTenthsOfSec)}</div>
            </div>
        </Paper>
    );
}
