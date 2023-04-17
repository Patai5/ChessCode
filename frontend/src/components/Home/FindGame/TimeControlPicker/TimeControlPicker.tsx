/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import GradientButtonPicker, { Item } from "components/shared/GradientButtonPicker";
import Paper from "components/shared/Paper";
import { secToTime } from "utils/utils";
import { handleStartQueueingType } from "../FindGame";

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

type Props = { setQueuing: handleStartQueueingType; disabled?: boolean };
export default function TimeControlPicker(props: Props) {
    const items: { [key in keyof GameModes]: Item[] } = {
        Bullet: [],
        Blitz: [],
        Rapid: [],
    };
    Object.keys(gameModes).map((gameMode: keyof GameModes) => {
        items[gameMode] = [
            { name: gameMode, isTitle: true } as Item,
            ...gameModes[gameMode].timeControls.map(
                (timeControl) =>
                    ({
                        name: secToTime(timeControl),
                        callback: () => {
                            props.setQueuing({ gameMode, timeControl });
                        },
                    } as Item)
            ),
        ];
    });
    const buttonPickers = [
        Object.keys(gameModes).map((gameMode: keyof GameModes) => (
            <GradientButtonPicker
                items={items[gameMode]}
                key={gameMode}
                backgroundColors={gameModes[gameMode].backgroundColors}
                disabled={props.disabled}
            />
        )),
    ];

    return <Paper customCss={timeControlsPaperCss}>{...buttonPickers}</Paper>;
}
