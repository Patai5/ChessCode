/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { FaRegFlag } from "react-icons/fa";
import IconButton from "components/shared/IconButton";

const QuickActionsCss = css`
    display: flex;
    gap: 0.5em;
    height: 2.25em;
`;

type Props = {};
export default function ActionBar(props: Props) {
    // TODO: Implement on click handlers
    return (
        <div css={QuickActionsCss}>
            <IconButton icon={"½"} fontSize={1.5} tooltip="Propose a draw" onClick={() => {}} />
            <IconButton icon={FaRegFlag} tooltip="Resign" onClick={() => {}} />
        </div>
    );
}
