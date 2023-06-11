/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import Paper from "components/shared/Paper";
import React from "react";
import { useParams } from "react-router-dom";
import { Statuses as FriendStatus } from "types/friendStatuses";
import Friend from "./Friend/Friend";

type Username = string;
type Friends = { [key: Username]: FriendStatus };
interface FriendsAPIResponse {
    friends: Friends;
}

const FriendsContainerCss = css`
    display: flex;
    flex-direction: column;

    box-sizing: border-box;
    max-width: 90vw;
    width: 40em;
    margin: 2em auto;

    background: linear-gradient(#8a0020, #6f0951);

    color: white;
`;
const FriendsCss = css`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin: 0.4em;
    padding: 0.8em;
    box-shadow: 0 0.1em 0.1em rgba(0, 0, 0, 0.25);
`;

type Props = {};
export default function Friends(props: Props) {
    const [friends, setFriends] = React.useState<Friends | null>(null);

    const paramUsername = useParams().username;
    const clientUsername = React.useMemo(() => localStorage.getItem("username"), []);
    const username = paramUsername || clientUsername;
    const isSelfView = !paramUsername || paramUsername === clientUsername;

    const fetchFriends = async () => {
        try {
            const res = await axios({
                method: "get",
                url: `/api/friends/with_statuses/${username}`,
            });
            const data: FriendsAPIResponse = res.data;
            setFriends(data.friends);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    React.useEffect(() => {
        fetchFriends();
    }, [username]);

    return (
        <Paper customCss={FriendsContainerCss}>
            <h1>{isSelfView ? "Your friends" : `${username}'s friends`}</h1>
            <Paper customCss={FriendsCss} elevation={4}>
                {friends &&
                    Object.entries(friends).map(([username, friendStatus]) => (
                        <Friend username={username} friendStatus={friendStatus} key={username} />
                    ))}
            </Paper>
        </Paper>
    );
}
