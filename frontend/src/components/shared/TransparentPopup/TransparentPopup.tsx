/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import { ClosedAnimationCss, getSmoothPopupTransitionContainerCss, OpenAnimationCss } from "css/smoothPopupTransition";
import React from "react";

export const POPUP_ANIMATION_TIME_MS = 250;

const PopupCss = css`
    color: white;
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    background: rgba(36, 36, 36, 0.97);
    backdrop-filter: blur(0.1em);
    border-radius: 0.5em;
    pointer-events: auto;
    z-index: 1;

    ${getSmoothPopupTransitionContainerCss(POPUP_ANIMATION_TIME_MS)}
`;

const CenteringContainerCss = css`
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
`;

type Props = { show: boolean; children: React.ReactNode; customCss?: SerializedStyles };
export default function TransparentPopup(props: Props) {
    return (
        <div css={CenteringContainerCss}>
            <div css={[PopupCss, props.show === true ? OpenAnimationCss : ClosedAnimationCss, props.customCss]}>
                {props.children}
            </div>
        </div>
    );
}
