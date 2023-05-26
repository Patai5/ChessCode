/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import Button from "components/shared/Button";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import TransparentPopup, { PopupContent } from "components/shared/TransparentPopup/TransparentPopup";
import React from "react";
import getCSRF from "utils/getCSRF";

const InteractionsCss = css`
    display: flex;
    justify-content: center;
    gap: 1em;
    padding: 1em;
    margin-bottom: 1em;
`;

type Statuses = "friends" | "not_friends" | "friend_request_sent" | "friend_request_received";
type Status = { text: string; endpoint: string; method: string; next: Statuses };
export const FriendStatus: { [key in Statuses]: Status } = {
    friends: { text: "Remove friend", endpoint: "friend", method: "delete", next: "not_friends" },
    not_friends: {
        text: "Send friend request",
        endpoint: "friend_request",
        method: "post",
        next: "friend_request_sent",
    },
    friend_request_sent: {
        text: "Cancel friend request",
        endpoint: "friend_request",
        method: "delete",
        next: "not_friends",
    },
    friend_request_received: {
        text: "Accept friend request",
        endpoint: "friend_request",
        method: "post",
        next: "friends",
    },
};

type Props = { friendStatus: keyof typeof FriendStatus | null; username: string };
export default function UserInteractions(props: Props) {
    const [friendStatus, setFriendStatus] = React.useState<Status | null>(
        props.friendStatus && FriendStatus[props.friendStatus]
    );
    const [confirm, setConfirm] = React.useState(false);

    React.useEffect(() => {
        setFriendStatus(props.friendStatus && FriendStatus[props.friendStatus]);
    }, [props.friendStatus]);

    const handleFriendsAPI = async () => {
        try {
            setFriendStatus(FriendStatus[friendStatus!.next]);
            await axios({
                method: friendStatus!.method,
                url: `/api/friends/` + friendStatus!.endpoint,
                params: { username: props.username },
                headers: { "X-CSRFToken": getCSRF() },
            });
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    const handleFriendsOnClick = () => {
        if (friendStatus === FriendStatus.friends) setConfirm(true);
        else handleFriendsAPI();
    };

    const popupContent: PopupContent = {
        title: `Are you sure you want to remove ${props.username}?`,
        buttons: [
            { label: "Yes", onClick: handleFriendsAPI, closeWindow: true },
            { label: "Cancel", closeWindow: true },
        ],
    };

    return (
        <div css={InteractionsCss}>
            <TransparentPopup
                content={popupContent}
                show={confirm}
                cancelHandlers={{ onClosedCallback: () => setConfirm(false) }}
            />
            {friendStatus && <Button label={friendStatus.text} onClick={handleFriendsOnClick} />}
            {friendStatus && <Button label="Play" />}
        </div>
    );
}
