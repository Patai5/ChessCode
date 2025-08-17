import { css } from "@emotion/react";

const OPPONENT_PROFILE_BUTTON = css`
    :hover {
        text-decoration: underline;
        background-color: #4d4d4d;
    }
`;
const PROFILE_PICTURE_ICON = css`
    width: 1.75em;
    height: 1.75em;
`;
const ANONYMOUS_USER_ICON = css`
    width: 2.2em;
    height: 2.2em;
    // The icon is not 100% size so to scale it the same as the profile picture we have to adjust the margin
    margin: -0.25em;
`;
const OPPONENT_USER_WRAPPER = css`
    display: flex;
    align-items: center;
    gap: 0.5em;
`;

export const CSS = {
    OPPONENT_PROFILE_BUTTON,
    PROFILE_PICTURE_ICON,
    ANONYMOUS_USER_ICON,
    OPPONENT_USER_WRAPPER,
} as const;
