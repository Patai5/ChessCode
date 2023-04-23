/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import useKeypress from "utils/useKeypress";
import { sleep } from "utils/utils";
import CloseButton from "./CloseButton/CloseButton";
import Content, { Content as ContentProps } from "./Content/Content";

export const animationLength = 250;

const PopupCss = css`
    color: white;
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    background: rgba(36, 36, 36, 0.97);
    backdrop-filter: blur(0.1em);
    border-radius: 0.5em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.4em 3.85em;
    grid-gap: 0.7em;
    width: 12em;
    height: 12em;

    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;

    transition: transform ${animationLength}ms ease-in-out;
    transition-property: opacity, transform;
    opacity: 0;
    transform: scale(0);
`;
const OpenAnimationCss = css`
    opacity: 1;
    transform: scale(1);
`;
const ClosedAnimationCss = css`
    opacity: 0;
    transform: scale(0);
`;

export interface PopupContent extends ContentProps {
    closeButtonText: string;
}
export interface CancelHandlers {
    onClosingCallback: () => void;
    onClosedCallback: () => void;
}

type Props = { content: PopupContent; show: boolean; cancelHandlers: CancelHandlers };
export default function TransparentPopup(props: Props) {
    const [show, setShow] = React.useState<boolean | null>(props.show);
    const firstRender = React.useRef(true);

    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        props.show ? setShow(true) : handleClose();
    }, [props.show]);

    const handleClose = React.useCallback(async () => {
        console.log("handleClose");
        if (show === false) return;
        props.cancelHandlers.onClosingCallback();
        setShow(false);
        await sleep(animationLength);
        props.cancelHandlers.onClosedCallback();
    }, [show]);

    useKeypress("Escape", handleClose);

    return (
        <div css={[PopupCss, show === true ? OpenAnimationCss : ClosedAnimationCss]}>
            <Content content={props.content} />
            <CloseButton
                label={props.content.closeButtonText}
                closePopup={() => {
                    console.log(show);
                    handleClose();
                }}
            />
        </div>
    );
}
