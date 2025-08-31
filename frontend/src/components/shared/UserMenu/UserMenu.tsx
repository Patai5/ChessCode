/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import Dropdown, { DropdownItems } from "components/shared/Dropdown/Dropdown";
import ProfilePicture from "components/shared/ProfilePicture";
import { AppContext } from "hooks/appContext";
import React from "react";
import { FaSignInAlt, FaSignOutAlt, FaTrophy, FaUser, FaUserFriends } from "react-icons/fa";
import { NavigateFunction, useNavigate } from "react-router-dom";
import getCSRF from "utils/getCSRF";
import { PATHS } from "../../constants";

type SignOutOptions = {
    appContext: React.ContextType<typeof AppContext>;
    navigate: NavigateFunction;
};

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
    const { username } = appContext;

    const navigate = useNavigate();

    const dropdownItems = username
        ? getLoggedInUserMenuOptions({ username, appContext, navigate })
        : getAnonymousUserSignInMenuOptions(navigate);

    return (
        <div css={MenuCss}>
            <Dropdown dropdownItems={dropdownItems} customCss={UserMenuCss} />
        </div>
    );
}

/**
 * Gets the dropdown menu items options for logged-in users.
 */
const getLoggedInUserMenuOptions = (options: { username: string } & SignOutOptions): DropdownItems => {
    const { username, navigate } = options;

    const mainDisplayButton = {
        image: <ProfilePicture username={username} />,
        text: username,
        onClick: () => signOut(options),
    };
    const items = [
        { text: "Profile", icon: FaUser, onClick: () => navigate(PATHS.PROFILE(username)) },
        { text: "Friends", icon: FaUserFriends, onClick: () => navigate(PATHS.FRIENDS({ username: null })) },
        { text: "Play", icon: FaTrophy, onClick: () => navigate(PATHS.HOME) },
        { text: "Sign out", icon: FaSignOutAlt, onClick: () => signOut(options) },
    ];

    return { main: mainDisplayButton, items, dropdownCss: DropdownCss };
};

/**
 * Signs the user out by clearing the username from the app context and navigating to the login page.
 */
const signOut = (options: SignOutOptions) => {
    const { appContext, navigate } = options;

    appContext.setUsername(null);

    axios({
        method: "post",
        url: "/api/auth/logout",
        headers: { "X-CSRFToken": getCSRF() },
    });

    navigate(PATHS.LOGIN);
};

const getAnonymousUserSignInMenuOptions = (navigate: NavigateFunction): DropdownItems => {
    const mainDisplayButton = {
        icon: FaSignInAlt,
        text: "Sign in",
        onClick: () => navigate(PATHS.LOGIN),
    };

    return { main: mainDisplayButton, items: [], dropdownCss: DropdownCss };
};
