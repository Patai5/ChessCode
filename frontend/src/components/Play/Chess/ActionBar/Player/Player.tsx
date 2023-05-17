/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Paper from "components/shared/Paper";
import ProfilePicture from "components/shared/ProfilePicture";

const PlayerContainer = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;

    margin-right: auto;
`;
const IconCss = css`
    width: 1.75em;
    height: 1.75em;
`;
const UsernameCss = css`
    color: white;
    margin: 0;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;
    font-size: 0.8em;
`;

type Props = { username: string };
export default function Player(props: Props) {
    return (
        <Paper customCss={PlayerContainer} elevation={1} white={true}>
            <ProfilePicture customCss={IconCss} username={props.username} />
            <p css={UsernameCss}>{props.username}</p>
        </Paper>
    );
}
