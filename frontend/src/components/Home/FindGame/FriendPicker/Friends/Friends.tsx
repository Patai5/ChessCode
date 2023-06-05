/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Friend, { Username } from "./Friends/Friend";

const FriendsCss = css`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 0.5em;
    overflow-y: auto;
    height: 50vh;
    width: 16em;
    box-sizing: border-box;
`;
const TextCss = css`
    text-align: center;
    margin: 0;
    margin-top: 1.75em;
    font-size: 1.3em;
    font-family: "montserrat";
`;

export type Usernames = Username[];

type Props = { friends: Usernames; setSelectedFriend: (friend: Username | null) => void };
export default function Friends(props: Props) {
    return (
        <div css={FriendsCss}>
            {props.friends.length === 0 ? (
                <p css={TextCss}>No friends with such username</p>
            ) : (
                props.friends.map((friend, index) => (
                    <Friend username={friend} onClick={() => props.setSelectedFriend(friend)} key={index} />
                ))
            )}
        </div>
    );
}
