import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import { Status as FriendStatus } from "types/friendStatuses";
import getCSRF from "./getCSRF";

export const handleFriendsAPI = async (friendStatus: FriendStatus, username: string) => {
    try {
        await axios({
            method: friendStatus.method,
            url: `/api/friends/` + friendStatus!.endpoint,
            params: { username: username },
            headers: { "X-CSRFToken": getCSRF() },
        });
    } catch (err) {
        ErrorQueueClass.handleError(err);
    }
};
