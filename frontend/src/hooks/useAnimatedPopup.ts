import { SerializedStyles } from "@emotion/react";
import { ANIMATION_STATE, AnimationState } from "components/constants";
import React from "react";

type Options = {
    animationDurationMs: number;
    isOpen: boolean;
    cssOptions: { opened: SerializedStyles | SerializedStyles[]; closed: SerializedStyles | SerializedStyles[] };
};

export const useAnimatedPopupCss = (
    options: Options,
): { state: AnimationState; cssState: SerializedStyles | SerializedStyles[] } => {
    const { animationDurationMs, isOpen, cssOptions } = options;

    const [animationState, setAnimationState] = React.useState<AnimationState>(ANIMATION_STATE.CLOSED);
    const [cssState, setCssState] = React.useState<SerializedStyles | SerializedStyles[]>(cssOptions.closed);
    const timeout = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (isOpen) handleOpen();
        else handleClose();
    }, [isOpen]);

    const handleOpen = () => {
        setAnimationState(ANIMATION_STATE.OPENING);

        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setAnimationState(ANIMATION_STATE.OPEN), animationDurationMs);

        // Wrapping the call with requestAnimationFrame makes sure that the component is first initialized with the
        // proper closed state. Otherwise the animation would just skip straight to the opened state.
        requestAnimationFrame(() => setCssState(cssOptions.opened));
    };

    const handleClose = () => {
        const isClosedOnFirstRender = animationState === ANIMATION_STATE.CLOSED;
        if (isClosedOnFirstRender) return;

        setAnimationState(ANIMATION_STATE.CLOSING);
        setCssState(cssOptions.closed);

        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setAnimationState(ANIMATION_STATE.CLOSED), animationDurationMs);
    };

    return { state: animationState, cssState };
};
