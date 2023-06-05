import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import MessageBox, { PopupContent } from "components/shared/MessageBox/MessageBox";
import React from "react";
import { FriendStatus, Status, Statuses } from "types/friendStatuses";
import getCSRF from "utils/getCSRF";

export default function useFriendsButton(initialFriendStatus: Statuses | null, username: string | null) {
    const [friendStatus, setFriendStatus] = React.useState<Status | null>(
        initialFriendStatus && FriendStatus[initialFriendStatus]
    );
    const [confirm, setConfirm] = React.useState(false);

    const handleFriendsAPI = async () => {
        try {
            await axios({
                method: friendStatus!.method,
                url: `/api/friends/` + friendStatus!.endpoint,
                params: { username: username },
                headers: { "X-CSRFToken": getCSRF() },
            });
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    React.useEffect(() => {
        setFriendStatus(initialFriendStatus && FriendStatus[initialFriendStatus]);
    }, [initialFriendStatus]);

    const handleSetFriendStatus = () => {
        setFriendStatus(FriendStatus[friendStatus!.next]);
        handleFriendsAPI();
    };

    const handleFriendsOnClick = () => {
        if (friendStatus === FriendStatus.friends) setConfirm(true);
        else handleSetFriendStatus();
    };

    const popupContent: PopupContent = {
        title: `Are you sure you want to remove ${username}?`,
        buttons: [
            { label: "Yes", onClick: handleSetFriendStatus, closeWindow: true },
            { label: "Cancel", closeWindow: true },
        ],
    };

    const confirmPopup = (
        <MessageBox
            content={popupContent}
            show={confirm}
            cancelHandlers={{ onClosedCallback: () => setConfirm(false) }}
        />
    );

    return { friendStatus, handleFriendsOnClick, confirmPopup };
}
