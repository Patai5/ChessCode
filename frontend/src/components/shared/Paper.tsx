/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import React from "react";

const paperCss = css`
    border-radius: 0.35em;
    padding: 0.5em;
    box-shadow: 0.15em 0.15em 0.4em rgba(0, 0, 0, 0.25);
`;

type Props = {
    elevation?: number;
    white?: boolean;
    customCss?: SerializedStyles;
    children: React.ReactNode;
    applyProps?: any;
};
export default function Paper(props: Props) {
    const { elevation = 3, white = false } = props;

    const color = ((white ? "255" : "0") + ", ").repeat(3);
    const ElevationCss = css`
        background: rgba(${color}${0.05 * elevation});
    `;

    return (
        <div css={[paperCss, ElevationCss, props.customCss]} {...props.applyProps}>
            {props.children}
        </div>
    );
}
