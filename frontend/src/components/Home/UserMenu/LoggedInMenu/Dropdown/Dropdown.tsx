/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Item from "./Item/Item";

export const TransitionDuration = 0.25; // In seconds

const DropdownCss = css`
    background-color: #3636367d;
    border-bottom-left-radius: 1em;
    opacity: 1;
    max-height: 6em;
    overflow: hidden;
    transition: ${TransitionDuration}s ease-in-out;

    div:last-child {
        border-bottom-left-radius: 1em;
    }
`;
const InactiveCss = css`
    max-height: 0;
    opacity: 0;
`;

type Props = { isActive: boolean; username: string };
export default function Dropdown(props: Props) {
    const navigate = useNavigate();

    // TODO: Implement sign out
    return (
        <div css={[DropdownCss, !props.isActive && InactiveCss]}>
            <Item icon={FaUser} text="Profile" onClick={() => navigate("/profile/" + props.username)} />
            <Item icon={FaSignOutAlt} text="Sign out" onClick={() => {}} />
        </div>
    );
}
