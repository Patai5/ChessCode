/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import ChessTimer, { TimeMs } from "./ChessTimer/ChessTimer";
import QuickActions from "./QuickActions/QuickActions";

const ActionBarCss = css`
    margin: 0.5em 0 0.5em 0;
    margin-left: auto;

    display: flex;
    gap: 0.5em;
    flex-direction: horizontal;
    align-items: center;
`;

type Props = { isMain: boolean; time: TimeMs; timerPaused: boolean };
export default function ActionBar(props: Props) {
    return (
        <div css={ActionBarCss}>
            {props.isMain && <QuickActions />}
            <ChessTimer time={props.time} paused={props.timerPaused} />
        </div>
    );
}
