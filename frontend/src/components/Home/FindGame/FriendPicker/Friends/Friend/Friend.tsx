/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import ProfilePicture from "components/shared/ProfilePicture";

const FriendCss = css`
    display: flex;
    align-items: center;
    gap: 0.5em;
    width: 100%;
    box-sizing: border-box;
    padding: 0.75em;
    cursor: pointer;
    background-color: #3f3f3f;
    border-radius: 0.5em;

    transition: all 0.2s ease-in-out;
    transition-property: background-color, box-shadow;
    :hover {
        background-color: #4b4b4b;
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;
const FriendTextCss = css`
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    font-family: "Lexend Deca", sans-serif;
`;

export type Username = string;

type Props = { username: Username; onClick: () => void };
export default function Friend(props: Props) {
    return (
        <div css={FriendCss} onClick={props.onClick}>
            <ProfilePicture username={props.username} />
            <p css={FriendTextCss}>{props.username}</p>
        </div>
    );
}
