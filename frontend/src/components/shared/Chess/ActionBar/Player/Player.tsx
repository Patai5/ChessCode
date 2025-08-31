/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { PATHS } from "components/constants";
import Dropdown, { DropdownItems } from "components/shared/Dropdown/Dropdown";
import ProfilePicture from "components/shared/ProfilePicture";
import useFriendsButton from "hooks/useFriendsButton";
import { FaUser } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Statuses } from "types/friendStatuses";

const PlayerCss = css`
    margin-right: auto;
    border-radius: 0.35em;
`;
const IconCss = css`
    width: 1.75em;
    height: 1.75em;
`;
const UsernameCss = css`
    max-width: 10em;
    font-weight: 500;
    font-size: 0.8em;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const UsernameContainerCss = css`
    padding: 0.5em;
`;
const DropdownCss = css`
    left: 50%;
    translate: -50% 0;
    box-shadow: 0 0 0.5em 0.2em #000000ab, inset 0 0 0.3em #000000ab;
`;
type Props = { username: string | null; isOpponent: boolean; friendStatus: Statuses | null };
export default function Player(props: Props) {
    const { username, isOpponent } = props;

    const { friendStatus, handleFriendsOnClick, confirmPopup } = useFriendsButton(props.friendStatus, username);
    const navigate = useNavigate();

    const dropdownItems: DropdownItems = {
        main: {
            image: props.username ? (
                <ProfilePicture username={props.username} customCss={IconCss} />
            ) : (
                <IoIosGlobe css={IconCss} />
            ),
            text: props.username || "Anonymous",
            onClick: () => {},
            textCss: UsernameCss,
            customCss: UsernameContainerCss,
        },
        items: [],
        dropdownCss: DropdownCss,
    };
    if (username) {
        dropdownItems.items.push({ icon: FaUser, text: "Profile", onClick: () => navigate(PATHS.PROFILE(username)) });
    }
    if (friendStatus) {
        dropdownItems.items.push({ icon: friendStatus.icon, text: friendStatus.text, onClick: handleFriendsOnClick });
    }

    return (
        <>
            {confirmPopup}
            <Dropdown dropdownItems={dropdownItems} customCss={PlayerCss} upwards={!isOpponent} />
        </>
    );
}
