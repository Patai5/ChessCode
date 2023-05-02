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

export type Actions = { highlightDraw: boolean; resign: () => void; offerDraw: () => void };
type Props = { actions: Actions };
export default function ActionBar(props: Props) {
    return (
        <div css={QuickActionsCss}>
            <IconButton
                icon={"½"}
                fontSize={1.5}
                tooltip={props.actions.highlightDraw ? "Accept draw" : "Propose a draw"}
                onClick={props.actions.offerDraw}
                highlighted={props.actions.highlightDraw}
            />
            <IconButton icon={FaRegFlag} tooltip="Resign" onClick={props.actions.resign} />
        </div>
    );
}
