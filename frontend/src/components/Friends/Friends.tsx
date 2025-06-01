/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import Paper from "components/shared/Paper";
import UserMenu from "components/shared/UserMenu/UserMenu";
import { AppContext } from "hooks/appContext";
import React from "react";
import { FaUsers } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Friends } from "types/friendStatuses";
import FriendsTable from "./FriendsTable/FriendsTable";

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

    background: linear-gradient(#641987, #382195);

    color: white;
`;

const TitleContainerCss = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 1.5em;
    padding: 1em 0;
`;
const FriendsIconCss = css`
    font-size: 3em;
`;
const TitleCss = css`
    text-decoration: underline;
    text-underline-offset: 0.15em;
    margin: 0;
    font-size: 2em;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 600;
`;
const NoFriendsTextCss = css`
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;
    text-align: center;
    margin: 1em 0;
    opacity: 0.8;
`;

export default function Friends() {
    const [friends, setFriends] = React.useState<Friends | null>(null);
    const appContext = React.useContext(AppContext);

    const paramUsername = useParams().username;
    const clientUsername = appContext.username;
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
        if (username) fetchFriends();
    }, [username]);

    const NoFriendsText = isSelfView
        ? "No friends yet 😢 Find some in game!"
        : `${username} has no friends yet 😢 Send them an invite!`;

    const hasAnyFriends = friends && Object.keys(friends).length > 0;

    return (
        <>
            <UserMenu />

            <Paper customCss={FriendsContainerCss}>
                <div css={TitleContainerCss}>
                    <FaUsers css={FriendsIconCss} />
                    <h1 css={TitleCss}>{isSelfView ? "Your friends" : `${username}'s friends`}</h1>
                </div>
                {hasAnyFriends ? <FriendsTable friends={friends} /> : <p css={NoFriendsTextCss}>{NoFriendsText}</p>}
            </Paper>
        </>
    );
}
