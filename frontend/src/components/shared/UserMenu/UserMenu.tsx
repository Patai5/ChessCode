/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import Dropdown, { DropdownItems } from "components/shared/Dropdown/Dropdown";
import ProfilePicture from "components/shared/ProfilePicture";
import { AppContext } from "hooks/appContext";
import React from "react";
import { FaSignInAlt, FaSignOutAlt, FaTrophy, FaUser, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import getCSRF from "utils/getCSRF";

const UserMenuCss = css`
    border-radius: 0 0 0 1em;
`;
const MenuCss = css`
    position: Fixed;
    top: 0;
    right: 0;
`;
const DropdownCss = css`
    right: 0;
    border-radius: 1em 0 0 1em;
`;

export default function UserMenu() {
    const appContext = React.useContext(AppContext);
    const navigate = useNavigate();

    const clientUsername = appContext.username;

    const signOut = () => {
        appContext.setUsername(null);

        axios({
            method: "post",
            url: "/api/auth/logout",
            headers: { "X-CSRFToken": getCSRF() },
        });

        navigate("/login");
    };

    const dropdownItems: DropdownItems = {
        main: {
            icon: !clientUsername ? FaSignInAlt : undefined,
            image: clientUsername ? <ProfilePicture username={clientUsername} /> : undefined,
            text: clientUsername || "Sign in",
            onClick: () => {
                if (!clientUsername) signOut();
            },
        },
        items: [
            { icon: FaUser, text: "Profile", onClick: () => navigate("/profile/" + clientUsername) },
            { icon: FaUserFriends, text: "Friends", onClick: () => navigate("/friends") },
            { icon: FaTrophy, text: "Play", onClick: () => navigate("/") },
            { icon: FaSignOutAlt, text: "Sign out", onClick: signOut },
        ],
        dropdownCss: DropdownCss,
    };

    if (!clientUsername) {
        dropdownItems.items.splice(0, dropdownItems.items.length);
    }

    return (
        <div css={MenuCss}>
            <Dropdown dropdownItems={dropdownItems} customCss={UserMenuCss} isActive={true} />
        </div>
    );
}
