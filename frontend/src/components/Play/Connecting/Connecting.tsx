/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";

const connectingCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: white;
`;

type Props = {};
export default function Connecting(props: Props) {
    // TODO: Improve visual design
    return <div css={connectingCss}>Connecting...</div>;
}
