/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const getSmoothPopupTransitionContainerCss = (animationTimeMs: number) => css`
    transition: transform ${animationTimeMs}ms ease-in-out;
    transition-property: opacity, transform;
`;

export const OpenAnimationCss = css`
    opacity: 1;
    transform: scale(1);
`;
export const ClosedAnimationCss = css`
    opacity: 0;
    transform: scale(0);
`;
