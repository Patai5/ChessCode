/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import ChessTimer, { TimeMs } from "./ChessTimer/ChessTimer";
import QuickActions, { Actions } from "./QuickActions/QuickActions";

const ActionBarCss = css`
    margin: 0.5em 0 0.5em 0;
    margin-left: auto;

    display: flex;
    gap: 0.5em;
    flex-direction: horizontal;
    align-items: center;
`;

type Props = { time: TimeMs; timerPaused: boolean; actions?: Actions };
export default function ActionBar(props: Props) {
    return (
        <div css={ActionBarCss}>
            {props.actions && <QuickActions actions={props.actions} />}
            <ChessTimer time={props.time} paused={props.timerPaused} />
        </div>
    );
}
