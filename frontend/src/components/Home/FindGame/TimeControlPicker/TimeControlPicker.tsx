/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import GradientButtonPicker from "components/shared/GradientButtonPicker";
import Paper from "components/shared/Paper";

const playAgainstPickerCss = css``;

const timeControlsPaperCss = css`
    display: flex;
    flex-direction: column;
    gap: 0.45em;
`;

interface TimeControl {
    timeControls: string[];
    backgroundColors: [string, string];
}
interface GameModes {
    Bullet: TimeControl;
    Blitz: TimeControl;
    Rapid: TimeControl;
}
const gameModes: GameModes = {
    Bullet: { timeControls: ["10 sec", "30 sec", "1 min"], backgroundColors: ["#760089", "#00836B"] },
    Blitz: { timeControls: ["2 min", "3 min", "5 min"], backgroundColors: ["#940059", "#7D8800"] },
    Rapid: { timeControls: ["10 min", "20 min", "30 min"], backgroundColors: ["#B84200", "#8B0086"] },
};

type Props = {};
export default function TimeControlPicker(props: Props) {
    return (
        <Paper customCss={timeControlsPaperCss}>
            {Object.keys(gameModes).map((gameMode: keyof GameModes) => (
                <GradientButtonPicker
                    items={[
                        { name: gameMode, isTitle: true },
                        ...gameModes[gameMode].timeControls.map((timeControl) => ({
                            name: timeControl,
                        })),
                    ]}
                    backgroundColors={gameModes[gameMode].backgroundColors}
                />
            ))}
        </Paper>
    );
}
