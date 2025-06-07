/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import useKeypress from "utils/useKeypress";
import { sleep } from "utils/utils";
import TransparentPopup, { POPUP_ANIMATION_TIME_MS } from "../TransparentPopup/TransparentPopup";
import ActionButton, { ButtonProps } from "./ActionButton/ActionButton";
import Content, { Content as ContentProps } from "./Content/Content";

const MessageBoxCss = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.4em 3.85em;
    grid-gap: 0.7em;
    max-width: 16em;
`;

export interface PopupContent extends ContentProps {
    buttons: ButtonProps[];
}
export interface CancelHandlers {
    onClosingCallback?: () => void;
    onClosedCallback?: () => void;
}

type Props = { content: PopupContent; show: boolean; cancelHandlers?: CancelHandlers };
export default function MessageBox(props: Props) {
    const [show, setShow] = React.useState<boolean>(props.show);
    const firstRender = React.useRef(true);

    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (props.show) setShow(true);
        else handleClose();
    }, [props.show]);

    const handleClose = React.useCallback(async () => {
        if (show === false) return;
        if (props.cancelHandlers && props.cancelHandlers.onClosingCallback) {
            props.cancelHandlers.onClosingCallback();
        }
        setShow(false);

        await sleep(POPUP_ANIMATION_TIME_MS);
        if (props.cancelHandlers && props.cancelHandlers.onClosedCallback) {
            props.cancelHandlers.onClosedCallback();
        }
    }, [show]);

    useKeypress("Escape", handleClose, show);

    return (
        <TransparentPopup show={show} customCss={MessageBoxCss}>
            <Content content={props.content} />
            {props.content.buttons.map((button) => (
                <ActionButton key={button.label} {...button} onClose={handleClose} />
            ))}
        </TransparentPopup>
    );
}
