/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const connectingCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: white;
`;

export default function Connecting() {
    // TODO: Improve visual design
    return <div css={connectingCss}>Connecting...</div>;
}
