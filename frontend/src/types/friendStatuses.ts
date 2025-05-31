import { IconType } from "react-icons";
import { FaUserCheck, FaUserPlus, FaUserSlash, FaUserTimes } from "react-icons/fa";

export type Friends = { [username: string]: Statuses };

export type Statuses = "friends" | "not_friends" | "friend_request_sent" | "friend_request_received";

export type Status = { text: string; endpoint: string; method: string; next: Statuses; icon: IconType };

export const FriendStatus: { [key in Statuses]: Status } = {
    friends: {
        text: "Remove friend",
        endpoint: "friend",
        method: "delete",
        next: "not_friends",
        icon: FaUserSlash,
    },
    not_friends: {
        text: "Send friend request",
        endpoint: "friend_request",
        method: "post",
        next: "friend_request_sent",
        icon: FaUserPlus,
    },
    friend_request_sent: {
        text: "Cancel friend request",
        endpoint: "friend_request",
        method: "delete",
        next: "not_friends",
        icon: FaUserTimes,
    },
    friend_request_received: {
        text: "Accept friend request",
        endpoint: "friend_request",
        method: "post",
        next: "friends",
        icon: FaUserCheck,
    },
};
