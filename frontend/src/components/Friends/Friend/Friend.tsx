/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Paper from "components/shared/Paper";
import ProfilePicture from "components/shared/ProfilePicture";
import { useNavigate } from "react-router-dom";
import { Statuses as FriendStatuses } from "types/friendStatuses";
import FriendStatusButton from "./FriendStatusButton/FriendStatusButton";

const FriendCss = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: min(2em, 5%);
    box-sizing: border-box;
    box-shadow: 0 0.1em 0.1em rgba(0, 0, 0, 0.25);

    cursor: pointer;
    transition: all 0.3s ease;
    transition-property: box-shadow, background-color;

    :hover {
        box-shadow: 0 0.1em 0.1em rgba(0, 0, 0, 0.25), inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const UsernameCss = css`
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
`;

type Props = { username: string; friendStatus: FriendStatuses };
export default function Friend(props: Props) {
    const navigate = useNavigate();

    const handleFriendOnClick = () => {
        navigate(`/profile/${props.username}`);
    };

    return (
        <Paper customCss={FriendCss} elevation={2} applyProps={{ onClick: handleFriendOnClick }}>
            <ProfilePicture username={props.username} />
            <p css={UsernameCss}>{props.username}</p>
            <FriendStatusButton username={props.username} friendStatus={props.friendStatus} />
        </Paper>
    );
}
