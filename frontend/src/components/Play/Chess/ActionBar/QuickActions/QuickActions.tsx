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

export type Actions = { resign: () => void; offerDraw: () => void };
type Props = { actions: Actions };
export default function ActionBar(props: Props) {
    return (
        <div css={QuickActionsCss}>
            <IconButton icon={"½"} fontSize={1.5} tooltip="Propose a draw" onClick={props.actions.offerDraw} />
            <IconButton icon={FaRegFlag} tooltip="Resign" onClick={props.actions.resign} />
        </div>
    );
}
