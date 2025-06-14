import { css, SerializedStyles } from "@emotion/react";

type ChessSquareCss = {
    BACKGROUND: SerializedStyles;
    HOVERING_OVER: SerializedStyles;
    VALID_MOVE: SerializedStyles;
    PROMOTION_SELECT: SerializedStyles;
    LAST_MOVE: SerializedStyles;
};

const SQUARE = css`
    width: 3.5em;
    height: 3.5em;
`;

const PIECE = css`
    ${SQUARE};

    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
`;

const SELECTED_PIECE = css`
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
`;

const LIGHT_SQUARE: ChessSquareCss = {
    BACKGROUND: css`
        background-color: rgb(240, 217, 181);
    `,
    HOVERING_OVER: css`
        box-shadow: none;
        background-color: rgb(255, 193, 101);
    `,
    VALID_MOVE: css`
        background-color: rgb(240, 217, 181);
        box-shadow: 0px 0px 0.5em 0.2em rgb(255, 188, 83) inset;
    `,
    PROMOTION_SELECT: css`
        background-color: rgb(255, 101, 101);
    `,
    LAST_MOVE: css`
        background-color: rgb(255, 193, 101);
    `,
};
const DARK_SQUARE: ChessSquareCss = {
    BACKGROUND: css`
        background-color: rgb(181, 136, 99);
    `,
    HOVERING_OVER: css`
        box-shadow: none;
        background-color: rgb(207, 135, 62);
    `,
    VALID_MOVE: css`
        background-color: rgb(181, 136, 99);
        box-shadow: 0px 0px 0.5em 0.2em rgb(255, 156, 40) inset;
    `,
    PROMOTION_SELECT: css`
        background-color: rgb(207, 62, 62);
    `,
    LAST_MOVE: css`
        background-color: rgb(207, 135, 62);
    `,
};

export const CSS = {
    SQUARE,
    SELECTED_PIECE,
    PIECE,
    LIGHT_SQUARE,
    DARK_SQUARE,
} as const;
