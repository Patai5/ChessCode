/** @jsxImportSource @emotion/react */
import { css, jsx, SerializedStyles } from "@emotion/react";
import React from "react";

const paperCss = css`
    background: rgba(0, 0, 0, 0.15);
    box-shadow: 0px 0.175em 0.175em rgba(0, 0, 0, 0.25);
    border-radius: 0.35em;
    padding: 0.5em;
`;

type Props = { customCss?: SerializedStyles; children: React.ReactNode };
export default function GradientButtonPicker(props: Props) {
    return <div css={[paperCss, props.customCss]}>{props.children}</div>;
}
