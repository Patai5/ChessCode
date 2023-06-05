/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import TransparentPopup from "components/shared/TransparentPopup/TransparentPopup";
import React from "react";
import useKeypress from "utils/useKeypress";
import CloseButton from "./CloseButton/CloseButton";
import FriendSearch from "./FriendSearch/FriendSearch";
import Friends, { Usernames } from "./Friends/Friends";
import { Username } from "./Friends/Friends/Friend";
import NoFriends from "./NoFriends/NoFriends";

const FriendPickerCss = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5em 2.5em;
    grid-gap: 0.7em;
    position: relative;
`;

type PlayersAPI = { friends: Usernames };

type Props = { show: boolean; closeFriendPicker: () => void; setSelectedFriend: (friend: Username | null) => void };
export default function FriendPicker(props: Props) {
    const [friends, setFriends] = React.useState<Usernames>([]);
    const [searchedFriends, setSearchedFriends] = React.useState<Usernames>([]);
    const isFirstFetch = React.useRef(false);

    useKeypress("Escape", () => props.closeFriendPicker());

    const fetchFriends = async () => {
        const username = localStorage.getItem("username");
        try {
            const data: PlayersAPI = (await axios({ method: "GET", url: `/api/friends/${username}` })).data;
            setFriends(data.friends);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    React.useEffect(() => {
        if (props.show === true && isFirstFetch.current === false) {
            isFirstFetch.current = true;
            fetchFriends();
        }
    }, [props.show]);

    return (
        <TransparentPopup show={props.show} customCss={FriendPickerCss}>
            <CloseButton onClick={props.closeFriendPicker} />
            {friends.length === 0 ? (
                <NoFriends />
            ) : (
                <>
                    <FriendSearch friends={friends} setSearchedFriends={setSearchedFriends} />
                    <Friends friends={searchedFriends} setSelectedFriend={props.setSelectedFriend} />
                </>
            )}
        </TransparentPopup>
    );
}
