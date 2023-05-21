/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import Button from "components/shared/Button";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import getCSRF from "utils/getCSRF";

const InteractionsCss = css`
    display: flex;
    gap: 1em;
    padding: 1em;
`;

type Status = { text: string; endpoint: string; method: string };
type Statuses = "friends" | "not_friends" | "friend_request_sent" | "friend_request_received";
export const FriendStatus: { [key in Statuses]: Status } = {
    friends: { text: "Remove friend", endpoint: "friend", method: "delete" },
    not_friends: { text: "Send friend request", endpoint: "friend_request", method: "post" },
    friend_request_sent: { text: "Cancel friend request", endpoint: "friend_request", method: "delete" },
    friend_request_received: { text: "Accept friend request", endpoint: "friend_request", method: "post" },
};

type Props = { friendStatus: keyof typeof FriendStatus | null; username: string };
export default function UserInteractions(props: Props) {
    const friendStatus = props.friendStatus && FriendStatus[props.friendStatus];
    if (!friendStatus) return null;

    const handleFriendsOnClick = async () => {
        try {
            const res = await axios({
                method: friendStatus.method,
                url: `/api/friends/` + friendStatus.endpoint,
                params: { username: props.username },
                headers: { "X-CSRFToken": getCSRF() },
            });
            console.log(res.data);
        } catch (err) {
            ErrorQueueClass.addError(err);
        }
    };

    return (
        <div css={InteractionsCss}>
            {props.friendStatus && <Button label={friendStatus.text} onClick={handleFriendsOnClick} />}
            {props.friendStatus && <Button label="Play" />}
        </div>
    );
}
