/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "components/shared/Button";
import Paper from "components/shared/Paper";
import ProfilePicture from "components/shared/ProfilePicture";
import useFriendsButton from "hooks/useFriendsButton";
import { useNavigate } from "react-router-dom";
import { Statuses as FriendStatuses } from "types/friendStatuses";
import { PATHS } from "../../../constants";

const FriendCss = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: min(2em, 5%);
    box-sizing: border-box;
    box-shadow: 0 0.1em 0.1em rgba(0, 0, 0, 0.25);
    padding: 0.5em 1em;

    cursor: pointer;
    transition: all 0.3s ease;
    transition-property: box-shadow, background-color;

    :hover {
        box-shadow: 0 0.1em 0.1em rgba(0, 0, 0, 0.25), inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.1);
    }
`;
const UsernameCss = css`
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ButtonCss = css`
    background-color: #00000025;
    margin-left: auto;
    white-space: nowrap;
    padding: 0.5em 1.5em;

    box-shadow: inset 0 0 rgba(0, 0, 0, 0), 0 0 0.1em rgba(255, 255, 255, 0.5);
    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1), 0 0 0.2em rgba(255, 255, 255, 0.5);
    }
`;

type Props = { username: string; friendStatus: FriendStatuses };
export default function Friend(props: Props) {
    const { friendStatus, handleFriendsOnClick, confirmPopup } = useFriendsButton(props.friendStatus, props.username);
    const navigate = useNavigate();

    const handleFriendOnClick = () => {
        navigate(PATHS.PROFILE(props.username));
    };

    return (
        <>
            {confirmPopup}
            <Paper
                customCss={FriendCss}
                elevation={2}
                applyProps={{
                    onClick: handleFriendOnClick,
                }}
            >
                <ProfilePicture username={props.username} />
                <p css={UsernameCss}>{props.username}</p>

                {friendStatus && (
                    <Button
                        fontSize="0.8em"
                        customCss={ButtonCss}
                        icon={friendStatus.icon}
                        label={friendStatus.text}
                        onClick={handleFriendsOnClick}
                    />
                )}
            </Paper>
        </>
    );
}
