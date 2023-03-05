/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import GradientButtonPicker from "components/shared/GradientButtonPicker";

type Props = {};
export default function PlayAgainstPicker(props: Props) {
    return (
        <GradientButtonPicker
            backgroundColors={["#006f72", "#00764b"]}
            items={[{ name: "Play a Random" }, { name: "Play a Friend" }]}
        />
    );
}
