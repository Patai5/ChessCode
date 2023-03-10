/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { secToTime } from "utils/utils";

const timeElapsedCss = css`
    font-family: "Montserrat";
    font-weight: 300;
    font-style: normal;
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
`;

type Props = {};
export default function TimeElapsed(props: Props) {
    const [elapsedTime, setElapsedTime] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => setElapsedTime((time) => time + 1), 1000);
        return () => clearInterval(interval);
    });

    return <p css={timeElapsedCss}>Time elapsed: {secToTime(elapsedTime)}</p>;
}
