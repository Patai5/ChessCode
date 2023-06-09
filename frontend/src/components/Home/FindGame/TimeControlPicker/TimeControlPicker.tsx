/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import GradientButtonPicker, {
    Button,
    ButtonGroup,
    GradientButtonPickerMethods,
} from "components/shared/GradientButtonPicker";
import Paper from "components/shared/Paper";
import React from "react";
import { secToTime } from "utils/utils";
import { handleStartQueueingType } from "../FindGame";

const timeControlsPaperCss = css`
    display: flex;
    flex-direction: column;
    gap: 0.45em;
`;

export interface TimeControlPickerMethods {
    resetButtons: () => void;
}

type Background = [string, string];
type TimeS = number;
type TimeControl = TimeS;
type GameModeNames = "Bullet" | "Blitz" | "Rapid";

type GameMode = {
    name: GameModeNames;
    timeControls: TimeControl[];
};

interface ColoredGameMode extends GameMode {
    backgroundColors: Background;
}
interface ColoredButtonGroup extends ButtonGroup {
    backgroundColors: Background;
}

type GameModes = {
    [key in GameModeNames]: ColoredGameMode;
};

const defaultGameModes: GameModes = {
    Bullet: { name: "Bullet", timeControls: [10, 30, 60], backgroundColors: ["#760089", "#00836B"] },
    Blitz: { name: "Blitz", timeControls: [120, 180, 300], backgroundColors: ["#940059", "#7D8800"] },
    Rapid: { name: "Rapid", timeControls: [600, 1200, 1800], backgroundColors: ["#B84200", "#8B0086"] },
};

type Props = { setQueuing: handleStartQueueingType; enabled: boolean };
const TimeControlPicker = React.forwardRef((props: Props, ref: React.Ref<TimeControlPickerMethods>) => {
    const getTimeControlItemsButtonProps = (gameMode: GameMode): Button[] => {
        return gameMode.timeControls.map((timeControl) => ({
            name: secToTime(timeControl),
            onSelect: () => {
                props.setQueuing({ gameMode: gameMode.name, timeControl });
            },
        }));
    };

    const getTimeControlButtonGroups = (): ColoredButtonGroup[] => {
        return Object.values(defaultGameModes).map((gameMode) => ({
            ref: React.useRef<GradientButtonPickerMethods>(null),
            backgroundColors: gameMode.backgroundColors,
            buttons: [
                {
                    name: gameMode.name,
                    isTitle: true,
                },
                ...getTimeControlItemsButtonProps(gameMode),
            ],
        }));
    };

    const ButtonGroups = getTimeControlButtonGroups();

    const resetButtons = () => {
        ButtonGroups.forEach((buttonGroup) => {
            buttonGroup.ref.current?.resetButtons();
        });
    };

    React.useImperativeHandle(ref, () => ({
        resetButtons: resetButtons,
    }));

    const buttonPickers = [
        ButtonGroups.map((buttonGroup, index) => (
            <GradientButtonPicker
                buttons={buttonGroup.buttons}
                key={index}
                backgroundColors={buttonGroup.backgroundColors}
                enabled={props.enabled}
                ref={buttonGroup.ref}
            />
        )),
    ];

    return <Paper customCss={timeControlsPaperCss}>{...buttonPickers}</Paper>;
});

export default TimeControlPicker;
