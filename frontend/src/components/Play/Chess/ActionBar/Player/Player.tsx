/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Dropdown, { DropdownItems } from "components/shared/Dropdown/Dropdown";
import ProfilePicture from "components/shared/ProfilePicture";
import { FaUser } from "react-icons/fa";

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
type Props = { username: string; isOpponent: boolean };
export default function Player(props: Props) {
    const dropdownItems: DropdownItems = {
        main: {
            image: <ProfilePicture username={props.username} customCss={IconCss} />,
            text: props.username,
            onClick: () => {},
            textCss: UsernameCss,
            customCss: UsernameContainerCss,
        },
        items: [{ icon: FaUser, text: "Profile", onClick: () => {} }],
        dropdownCss: DropdownCss,
    };
    if (props.isOpponent) dropdownItems.items.push({ icon: FaUser, text: "Friend", onClick: () => {} });

    return <Dropdown dropdownItems={dropdownItems} customCss={PlayerCss} upwards={!props.isOpponent} />;
}
