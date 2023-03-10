/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import GradientButtonPicker from "components/shared/GradientButtonPicker";
import Paper from "components/shared/Paper";
import { secToTime } from "utils/utils";
import { QueueState } from "../Queuing/Queuing";

const timeControlsPaperCss = css`
    display: flex;
    flex-direction: column;
    gap: 0.45em;
`;
interface TimeControl {
    timeControls: number[];
    backgroundColors: [string, string];
}
interface GameModes {
    Bullet: TimeControl;
    Blitz: TimeControl;
    Rapid: TimeControl;
}
const gameModes: GameModes = {
    Bullet: { timeControls: [10, 30, 60], backgroundColors: ["#760089", "#00836B"] },
    Blitz: { timeControls: [120, 180, 300], backgroundColors: ["#940059", "#7D8800"] },
    Rapid: { timeControls: [600, 1200, 1800], backgroundColors: ["#B84200", "#8B0086"] },
};

type Props = { setQueing: (arg0: QueueState) => void };
export default function TimeControlPicker(props: Props) {
    return (
        <Paper customCss={timeControlsPaperCss}>
            {Object.keys(gameModes).map((gameMode: keyof GameModes) => (
                <GradientButtonPicker
                    items={[
                        { name: gameMode, isTitle: true },
                        ...gameModes[gameMode].timeControls.map((timeControl) => ({
                            name: secToTime(timeControl),
                            callback: () => {
                                props.setQueing({ gameMode, timeControl });
                            },
                        })),
                    ]}
                    key={gameMode}
                    backgroundColors={gameModes[gameMode].backgroundColors}
                />
            ))}
        </Paper>
    );
}
