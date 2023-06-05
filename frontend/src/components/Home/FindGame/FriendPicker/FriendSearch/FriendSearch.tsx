/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { Usernames } from "../Friends/Friends";

const InputCss = css`
    padding: 0.85em;
    background: #333333;
    border: none;
    border-radius: 0.5em;
    color: white;
    font-size: 1em;

    transition: outline 0.5s;
    outline: 0.15em solid #333333;
    :focus {
        outline: 0.15em solid #444444;
    }
`;

type Props = { friends: Usernames; setSearchedFriends: (friends: Usernames) => void };
export default function FriendSearch(props: Props) {
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    React.useEffect(() => {
        if (searchTerm === "") {
            props.setSearchedFriends(props.friends);
            return;
        }

        const searchTermLowerCase = searchTerm.toLowerCase();
        const newFriends = props.friends.filter((friend) => friend.toLowerCase().includes(searchTermLowerCase));
        props.setSearchedFriends(newFriends);
    }, [searchTerm, props.friends]);

    return (
        <input
            css={InputCss}
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
}
