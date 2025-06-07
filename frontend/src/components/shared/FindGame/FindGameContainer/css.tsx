import { css } from "@emotion/react";
import { POPUP_ANIMATION_TIME_MS } from "components/shared/TransparentPopup/TransparentPopup";
import { getSmoothPopupTransitionContainerCss } from "css/smoothPopupTransition";

const FIND_GAME = css`
    background: linear-gradient(#05586d, #520476);
    display: flex;
    width: 25em;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    padding: 1em;
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    border-radius: 15px;

    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    opacity: 0;
    transform: scale(0);

    ${getSmoothPopupTransitionContainerCss(POPUP_ANIMATION_TIME_MS)}
`;

const TITLE_TEXT = css`
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;
    margin: 0;
`;

const TITLE = css`
    ${TITLE_TEXT}
    font-size: 2.15em;
    text-decoration-line: underline;
    padding: 0;
`;

const PLAY_AGAINST_TITLE = css`
    ${TITLE_TEXT}
    font-size: 1.5em;
    padding: 0.5em 0;
`;

const MAIN_PAPER = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.9em;
`;

export const CSS = {
    FIND_GAME,
    TITLE,
    PLAY_AGAINST_TITLE,
    MAIN_PAPER,
} as const;
