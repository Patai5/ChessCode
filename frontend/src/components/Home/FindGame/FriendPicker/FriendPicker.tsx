/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import TransparentPopup from "components/shared/TransparentPopup/TransparentPopup";
import { AppContext } from "hooks/appContext";
import React from "react";
import useKeypress from "utils/useKeypress";
import CloseButton from "./CloseButton/CloseButton";
import FriendSearch from "./FriendSearch/FriendSearch";
import { Username } from "./Friends/Friend/Friend";
import Friends, { Usernames } from "./Friends/Friends";
import NoFriends from "./NoFriends/NoFriends";
export { Username };

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
    const appContext = React.useContext(AppContext);
    const isFirstFetch = React.useRef(false);

    useKeypress("Escape", () => props.closeFriendPicker(), props.show);

    const fetchFriends = async () => {
        try {
            const data: PlayersAPI = (await axios({ method: "GET", url: `/api/friends/${appContext.username}` })).data;
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
