/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import React from "react";

export const animationLength = 250;

const PopupCss = css`
    color: white;
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    background: rgba(36, 36, 36, 0.97);
    backdrop-filter: blur(0.1em);
    border-radius: 0.5em;

    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;

    transition: transform ${animationLength}ms ease-in-out;
    transition-property: opacity, transform;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
`;
const OpenAnimationCss = css`
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
`;
const ClosedAnimationCss = css`
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
`;

type Props = { show: boolean; children: React.ReactNode; customCss?: SerializedStyles };
export default function TransparentPopup(props: Props) {
    return (
        <div css={[PopupCss, props.show === true ? OpenAnimationCss : ClosedAnimationCss, props.customCss]}>
            {props.children}
        </div>
    );
}
