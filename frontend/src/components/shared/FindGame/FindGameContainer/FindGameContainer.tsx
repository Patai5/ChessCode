/** @jsxImportSource @emotion/react */
import { JSX } from "@emotion/react/jsx-runtime";
import { ANIMATION_STATE, AnimationState } from "components/constants";
import CloseButton from "components/shared/CloseButton/CloseButton";
import Paper from "components/shared/Paper";
import { POPUP_ANIMATION_TIME_MS } from "components/shared/TransparentPopup/TransparentPopup";
import { ClosedAnimationCss, OpenAnimationCss } from "css/smoothPopupTransition";
import { useAnimatedPopupCss } from "hooks/useAnimatedPopup";
import React from "react";
import { Username } from "../FriendPicker/FriendPicker";
import PlayAgainstPicker, { playAgainstType } from "../PlayAgainstPicker/PlayAgainstPicker";
import { QueueState } from "../Queuing/Queuing";
import TimeControlPicker from "../TimeControlPicker/TimeControlPicker";
import { CSS } from "./css";
import { FindGameContainerProps } from "./types";

export default function FindGameContainer(props: FindGameContainerProps) {
    const { playAgainstPlayer = null, findGamePopupControls } = props;

    const isPopup = !!findGamePopupControls;
    const { closeFindGamePopup, isFindGamePopupOpen, setIsFindGamePopupOpen } = findGamePopupControls || {};

    const [isFinalClose, setIsFinalClose] = React.useState(false);

    const useAnimatedPopupOptions = {
        animationDurationMs: POPUP_ANIMATION_TIME_MS,
        isOpen: isPopup ? isFindGamePopupOpen ?? false : true,
        cssOptions: { opened: OpenAnimationCss, closed: ClosedAnimationCss },
    };
    const { state, cssState: popupStateCss } = useAnimatedPopupCss(useAnimatedPopupOptions);

    const handleFinalClose = () => {
        setIsFinalClose(true);
        setIsFindGamePopupOpen?.(false);
    };
    useFinalCloseUseEffect({ state, isFinalClose, closeFindGamePopup });

    const title = getTitleElement(playAgainstPlayer);
    const underHeaderComponents = getUnderHeaderComponents(props);
    const maybeCloseButton = isPopup ? <CloseButton onClick={handleFinalClose} /> : null;

    return (
        <div css={[CSS.FIND_GAME, popupStateCss]}>
            {maybeCloseButton}
            {title}
            {underHeaderComponents}
        </div>
    );
}

/**
 * Returns the components that should be displayed under the header.
 * - If `playAgainstPlayer` is set, only the time control picker is returned, because the play picker is not needed.
 * - Otherwise, wrap both components together and return them both.
 */
const getUnderHeaderComponents = (props: FindGameContainerProps): JSX.Element => {
    const {
        playAgainstPlayer,
        playAgainstPickerRef,
        timeControlPickerRef,
        queuing,
        playAgainst,
        selectedFriend,
        handleStartQueueing,
        handleSetPlayAgainst,
    } = props;

    const timeControlPicker = (
        <TimeControlPicker
            enabled={shouldEnablePlayAgainstPicker({ queuing, playAgainst, selectedFriend })}
            setQueuing={handleStartQueueing}
            ref={timeControlPickerRef}
        />
    );

    if (playAgainstPlayer) return timeControlPicker;

    return (
        <Paper customCss={CSS.MAIN_PAPER}>
            <PlayAgainstPicker enabled={!queuing} setPlayAgainst={handleSetPlayAgainst} ref={playAgainstPickerRef} />
            {timeControlPicker}
        </Paper>
    );
};

/**
 * Returns a boolean indicating whether the play against picker should be enabled.
 * - Should only be enabled if the user is not currently queueing or selecting a friend to play against.
 */
const shouldEnablePlayAgainstPicker = (options: {
    queuing: QueueState | null;
    playAgainst: playAgainstType;
    selectedFriend: Username | null;
}): boolean => {
    const { queuing, playAgainst, selectedFriend } = options;

    if (queuing) return false;

    const isSelectingFriend = playAgainst === "friend" && selectedFriend === null;
    return !isSelectingFriend;
};

/**
 * Returns the title, which should either display a generic "Find A Game" title or a specific player username.
 */
const getTitleElement = (playAgainstPlayer: Username | null): JSX.Element => {
    const shouldDisplayGenericTitle = !playAgainstPlayer;
    if (shouldDisplayGenericTitle) return <h1 css={CSS.TITLE}>Find A Game</h1>;

    return (
        <h1 css={CSS.PLAY_AGAINST_TITLE}>
            Play against <i>{playAgainstPlayer}</i>
        </h1>
    );
};

/**
 * Handles calling the final close function of `closeFindGamePopup` if the state is to be permanently closed.
 */
const useFinalCloseUseEffect = (options: {
    state: AnimationState;
    isFinalClose: boolean;
    closeFindGamePopup: (() => void) | undefined;
}) => {
    const { state, isFinalClose, closeFindGamePopup } = options;

    React.useEffect(() => {
        const isToBePermanentlyClosed = state === ANIMATION_STATE.CLOSED && isFinalClose;
        if (isToBePermanentlyClosed) closeFindGamePopup?.();
    }, [state]);
};
