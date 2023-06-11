/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "components/shared/Button";
import useFriendsButton from "hooks/useFriendsButton";
import { Statuses as FriendStatuses } from "types/friendStatuses";

const ButtonCss = css`
    background-color: #00000025;
    margin-left: auto;
    white-space: nowrap;

    box-shadow: inset 0 0 rgba(0, 0, 0, 0), 0 0 0.1em rgba(255, 255, 255, 0.5);
    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1), 0 0 0.2em rgba(255, 255, 255, 0.5);
    }
`;

type Props = { username: string; friendStatus: FriendStatuses };
export default function FriendStatusButton(props: Props) {
    const { friendStatus, handleFriendsOnClick, confirmPopup } = useFriendsButton(props.friendStatus, props.username);
    return (
        <>
            {confirmPopup}
            {friendStatus && (
                <Button
                    customCss={ButtonCss}
                    icon={friendStatus.icon}
                    label={friendStatus.text}
                    onClick={handleFriendsOnClick}
                />
            )}
        </>
    );
}
