/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import Display from "./Display/Display";
import Dropdown, { TransitionDuration } from "./Dropdown/Dropdown";

const MenuCss = css`
    position: Fixed;
    top: 0;
    right: 0;
    overflow: hidden;

    transition: max-height ${TransitionDuration}s ease-in-out;
    border-bottom-left-radius: 1em;
    box-shadow: 0 0 0.5em #000000ab;
    background-color: #3636367d;
`;

type Props = {};
export default function UserMenu(props: Props) {
    const [openDropdown, setOpenDropdown] = React.useState(false);

    const clientUsername = React.useMemo(() => localStorage.getItem("username"), []);

    return (
        <div css={MenuCss} onMouseEnter={() => setOpenDropdown(true)} onMouseLeave={() => setOpenDropdown(false)}>
            <Display username={clientUsername} />
            {clientUsername && <Dropdown isActive={openDropdown} username={clientUsername} />}
        </div>
    );
}
