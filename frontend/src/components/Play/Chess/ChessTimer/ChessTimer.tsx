/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";

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

    // TODO: CSS and stuff
    return <div>{timeToString(time, showTenthsOfSec)}</div>;
}
