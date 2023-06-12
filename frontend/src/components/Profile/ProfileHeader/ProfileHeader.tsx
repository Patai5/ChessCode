/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Paper from "components/shared/Paper";
import ProfilePicture from "components/shared/ProfilePicture";
import { FaCalendarAlt, FaGamepad, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatDateString } from "utils/utils";
import InfoPoint from "./InfoPoint/InfoPoint";

const ProfileHeaderCss = css`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    gap: 1em;
    height: 10em;
`;
const ProfilePictureCss = css`
    height: 100%;
    width: auto;
`;
const ProfileInfoCss = css`
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
`;
const UsernameCss = css`
    margin: 0.4em 0 0 0;
    font-size: 2em;
    overflow: hidden;
    text-overflow: ellipsis;

    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 0.1em;

    font-family: "Lexend Deca", sans-serif;
    font-weight: 600;
`;
const InfoPointsCss = css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

export type ProfileDataProps = { username: string; joinedDate: string; friendsCount: number; gamesCount: number };

type Props = { data: ProfileDataProps | null };
export default function ProfileHeader(props: Props) {
    const navigate = useNavigate();
    if (!props.data) return null;

    const handleFriendsOnClick = () => {
        navigate(`/friends/${props.data!.username}`);
    };

    return (
        <Paper customCss={ProfileHeaderCss} elevation={1} white={true}>
            <ProfilePicture username={props.data.username} customCss={ProfilePictureCss} />
            <div css={ProfileInfoCss}>
                <div>
                    <p css={UsernameCss}>{props.data.username}</p>
                </div>
                <div css={InfoPointsCss}>
                    <InfoPoint
                        icon={FaCalendarAlt}
                        tooltip="Registered date"
                        data={formatDateString(props.data.joinedDate)}
                        iconCss={css`
                            font-size: 1.5em;
                            margin: 0.2em 0;
                        `}
                    />
                    <InfoPoint
                        icon={FaUserFriends}
                        tooltip="Total friends"
                        data={String(props.data.friendsCount)}
                        onClick={handleFriendsOnClick}
                    />
                    <InfoPoint icon={FaGamepad} tooltip="Total played games" data={String(props.data.gamesCount)} />
                </div>
            </div>
        </Paper>
    );
}
