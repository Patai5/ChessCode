import { SerializedStyles } from "@emotion/react";
import { ANIMATION_STATE, AnimationState } from "components/constants";
import React from "react";

type Options = {
    animationDurationMs: number;
    isOpen: boolean;
    cssOptions: { opened: SerializedStyles; closed: SerializedStyles };
};

export const useAnimatedPopupCss = (options: Options): { state: AnimationState; cssState: SerializedStyles } => {
    const { animationDurationMs, isOpen, cssOptions } = options;

    const [animationState, setAnimationState] = React.useState<AnimationState>(ANIMATION_STATE.OPENING);
    const [cssState, setCssState] = React.useState<SerializedStyles>(cssOptions.closed);

    React.useEffect(() => {
        if (isOpen) handleOpen();
        else handleClose();
    }, [isOpen]);

    const handleOpen = () => {
        const renderedClosedStateCallback = () => {
            setCssState(cssOptions.opened);
            setTimeout(() => setAnimationState(ANIMATION_STATE.OPEN), animationDurationMs);
        };

        setAnimationState(ANIMATION_STATE.OPENING);
        setCssState(cssOptions.closed);
        requestAnimationFrame(renderedClosedStateCallback);
    };

    const handleClose = () => {
        setAnimationState(ANIMATION_STATE.CLOSING);
        setCssState(cssOptions.closed);
        setTimeout(() => setAnimationState(ANIMATION_STATE.CLOSED), animationDurationMs);
    };

    return { state: animationState, cssState };
};
