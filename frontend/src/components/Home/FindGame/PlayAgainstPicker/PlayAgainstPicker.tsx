/** @jsxImportSource @emotion/react */
import GradientButtonPicker from "components/shared/GradientButtonPicker";

export type playAgainstType = "link" | "friend" | "random";

type Props = { setPlayAgainst: (playAgainst: playAgainstType) => void };
export default function PlayAgainstPicker(props: Props) {
    const deselect = () => {
        props.setPlayAgainst("random");
    };

    return (
        <GradientButtonPicker
            backgroundColors={["#006f72", "#00764b"]}
            items={[
                { name: "Create link", onSelect: () => props.setPlayAgainst("link"), onDeSelect: deselect },
                { name: "Play a Friend", onSelect: () => props.setPlayAgainst("friend"), onDeSelect: deselect },
            ]}
        />
    );
}
