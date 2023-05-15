/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import ProfilePicture from "components/shared/ProfilePicture";

const DisplayCss = css`
    display: flex;
    flex-direction: row;
    gap: 0.75em;
    justify-content: center;
    padding: 0.5em 0.8em;

    cursor: pointer;
    user-select: none;

    transition: box-shadow 0.2s ease-in-out;

    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;
const UsernameCss = css`
    margin: 0;
    align-self: center;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;
    color: white;
`;

type Props = { username: string };
export default function UserMenu(props: Props) {
    return (
        <div css={DisplayCss}>
            {props.username && <ProfilePicture username={props.username} />}
            <p css={UsernameCss}>{props.username}</p>
        </div>
    );
}
