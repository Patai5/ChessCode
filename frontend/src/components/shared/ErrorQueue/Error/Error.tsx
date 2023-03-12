/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { sleep } from "utils/utils";
import { BsExclamationTriangle } from "react-icons/bs";

const animationLength = 200;

const errorCss = css`
    border: 1px solid rgba(241, 6, 6, 0.81);
    background-color: rgba(220, 17, 1, 0.16);
    box-shadow: 0px 0px 2px #ff0303;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0.75em 2em 0.75em 0.5em;
    gap: 1.5em;
    border-radius: 0.25em;
    cursor: pointer;
    transition: background-color 0.5s;
    position: absolute;
    top: 0.5em;
    left: 50%;
    translate: -50% 0;
    z-index: 1;

    :hover {
        background-color: rgba(220, 17, 1, 0.33);
    }
`;
const textIconCss = css`
    color: #ff0303;
    text-shadow: 2px 1px #00040a;
`;
const iconCss = css``;
const textCss = css`
    font-size: 0.75em;
    font-family: "Roboto", sans-serif;
    margin: 0;
`;
const openingAnimationCss = css`
    animation: opening ${animationLength}ms ease-in-out forwards;
    @keyframes opening {
        0% {
            opacity: 0;
            translate: -50% -150%;
        }
        100% {
            opacity: 1;
            translate: -50% 0;
        }
    }
`;
const closingAnimationCss = css`
    animation: closing ${animationLength}ms ease-in-out forwards;
    @keyframes closing {
        0% {
            opacity: 1;
            translate: -50% 0;
        }
        100% {
            opacity: 0;
            translate: -50% -150%;
        }
    }
`;

export type ErrorType = {
    errorMessage: string;
    autoHideAfter?: number;
};

export const defaultHideAFter = 5000;

type Props = { error: ErrorType; closedCallback: () => void };
export default function Home(props: Props) {
    const [open, setOpen] = React.useState<boolean | null>(null);
    const [controller, setController] = React.useState(new AbortController());
    const { autoHideAfter = defaultHideAFter } = props.error;

    const handleClose = async (controller: AbortController) => {
        if (controller.signal.aborted) return;
        setOpen(false);
        await sleep(animationLength);
        if (controller.signal.aborted) return;
        controller.abort();
        props.closedCallback();
    };

    const animationsHandler = async (controller: AbortController) => {
        if (controller.signal.aborted) return;
        setOpen(true);
        await sleep(animationLength + autoHideAfter);
        await handleClose(controller);
    };

    React.useEffect(() => {
        const currentController = new AbortController();
        setController(currentController);
        animationsHandler(currentController);
    }, [props.error]);

    return (
        <div
            css={[errorCss, open === open && openingAnimationCss, open === false && closingAnimationCss]}
            onClick={() => handleClose(controller)}
        >
            <BsExclamationTriangle css={[textIconCss, iconCss]} />
            <p css={[textIconCss, textCss]}>{props.error.errorMessage}</p>
        </div>
    );
}
