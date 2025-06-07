/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "components/shared/Button";
import { FaUserPlus, FaUsers } from "react-icons/fa";

const NoFriendsCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 16em;
    gap: 1em;
`;
const IconCss = css`
    font-size: 4em;
`;
const TextCss = css`
    text-align: center;
    margin: 0;
    margin-top: -0.5em;
    font-family: "montserrat";
`;

export type Username = string;

export default function NoFriends() {
    return (
        <div css={NoFriendsCss}>
            <FaUsers css={IconCss} />
            <p css={TextCss}>
                Looks like your friends list is feeling a bit lonely! Invite new friends for a more enjoyable gaming
                experience!
            </p>
            <Button icon={FaUserPlus} onClick={() => console.log("INVITE")} label="Invite friends" />
        </div>
    );
}
