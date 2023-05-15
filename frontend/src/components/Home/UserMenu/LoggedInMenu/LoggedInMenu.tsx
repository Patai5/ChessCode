/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import Display from "./Display/Display";
import Dropdown, { TransitionDuration } from "./Dropdown/Dropdown";

const MenuCss = css`
    float: right;
    overflow: hidden;

    transition: ${TransitionDuration}s ease-in-out;
    border-bottom-left-radius: 1em;
    box-shadow: 0 0 0.5em #000000ab;
    background-color: #3636367d;
`;

type Props = { username: string };
export default function LoggedInMenu(props: Props) {
    const [openDropdown, setOpenDropdown] = React.useState(false);

    return (
        <div css={MenuCss} onMouseEnter={() => setOpenDropdown(true)} onMouseLeave={() => setOpenDropdown(false)}>
            <Display username={props.username} />
            <Dropdown isActive={openDropdown} username={props.username} />
        </div>
    );
}
