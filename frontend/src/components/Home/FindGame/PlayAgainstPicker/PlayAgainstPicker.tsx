/** @jsxImportSource @emotion/react */
import GradientButtonPicker, { GradientButtonPickerMethods } from "components/shared/GradientButtonPicker";
import React from "react";

export type playAgainstType = "link" | "friend" | "random";

type Props = { setPlayAgainst: (playAgainst: playAgainstType) => void; enabled: boolean };
const PlayAgainstPicker = React.forwardRef((props: Props, ref: React.Ref<GradientButtonPickerMethods>) => {
    const deselect = () => {
        props.setPlayAgainst("random");
    };

    return (
        <GradientButtonPicker
            ref={ref}
            enabled={props.enabled}
            backgroundColors={["#006f72", "#00764b"]}
            buttons={[
                { name: "Create link", onSelect: () => props.setPlayAgainst("link"), onDeSelect: deselect },
                { name: "Play a Friend", onSelect: () => props.setPlayAgainst("friend"), onDeSelect: deselect },
            ]}
        />
    );
});

export default PlayAgainstPicker;
