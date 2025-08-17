import { css } from "@emotion/react";
import { GAME_OUTCOME } from "types/game";

const GAME_ROW = css`
    background-color: #3d3d3d;
    cursor: pointer;
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    td {
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.5em;
    }
`;
const HOVER_ENABLED = css`
    :hover {
        background-color: #4d4d4d;
        td {
            border-right: 1px solid rgba(255, 255, 255, 0);
        }
    }
`;
const WINNER_COLORS = {
    [GAME_OUTCOME.WON]: css`
        color: #00ff00;
    `,
    [GAME_OUTCOME.LOST]: css`
        color: #ff0000;
    `,
    [GAME_OUTCOME.DRAW]: css`
        color: #b0b0b0;
    `,
} as const;

export const CSS = {
    GAME_ROW,
    HOVER_ENABLED,
    WINNER_COLORS,
} as const;
