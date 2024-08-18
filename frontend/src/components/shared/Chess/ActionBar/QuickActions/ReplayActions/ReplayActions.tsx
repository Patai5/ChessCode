/** @jsxImportSource @emotion/react */
import { IconButton, IconButtonProps } from "components/shared/IconButton/IconButton";
import { FaBackward, FaFastBackward, FaFastForward, FaForward } from "react-icons/fa";

export type ReplayActionsType = {
    goBack: ReplayAction;
    goForward: ReplayAction;
    goToEnd: ReplayAction;
    goToStart: ReplayAction;
};
type ReplayAction = { callback: () => void; isEnabled: boolean };

type Props = { actions: ReplayActionsType };

/**
 * Displays the replay actions (go back, forward, etc.) for the replay game.
 */
export default function ReplayActions(props: Props) {
    const { goBack, goForward, goToEnd, goToStart } = props.actions;

    const iconButtonProps: IconButtonProps[] = [
        {
            onClick: goToStart.callback,
            tooltip: "Go to start",
            isEnabled: goToStart.isEnabled,
            Icon: FaFastBackward,
            "data-testid": "go-to-start-button",
        },
        {
            onClick: goBack.callback,
            tooltip: "Go back",
            isEnabled: goBack.isEnabled,
            Icon: FaBackward,
            "data-testid": "go-back-button",
        },
        {
            onClick: goForward.callback,
            tooltip: "Go forward",
            isEnabled: goForward.isEnabled,
            Icon: FaForward,
            "data-testid": "go-forward-button",
        },
        {
            onClick: goToEnd.callback,
            tooltip: "Go to end",
            isEnabled: goToEnd.isEnabled,
            Icon: FaFastForward,
            "data-testid": "got-to-end-button",
        },
    ];

    const IconButtons = iconButtonProps.map((props, i) => <IconButton key={i} fontSize={1.25} {...props} />);

    return <>{...IconButtons}</>;
}
