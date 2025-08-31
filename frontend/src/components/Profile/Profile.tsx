/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import Paper from "components/shared/Paper";
import UserMenu from "components/shared/UserMenu/UserMenu";
import React from "react";
import { useParams } from "react-router-dom";
import { ProfileApiResponse } from "types/api/profile";
import ProfileHeader, { ProfileDataProps } from "./ProfileHeader/ProfileHeader";
import RecentGames from "./RecentGames/RecentGames";
import UserInteractions from "./UserInteractions/UserInteractions";

const ProfileCss = css`
    display: flex;
    flex-direction: column;

    box-sizing: border-box;
    max-width: 90vw;
    width: 45em;
    margin: 2em auto;

    color: white;
`;

export default function Profile() {
    const [profileData, setProfileData] = React.useState<ProfileApiResponse | null>(null);
    const params = useParams();
    const username: string = params.username!;

    const fetchUserData = async () => {
        try {
            const res = await axios({
                method: "get",
                url: `/api/user_interactions/profile/${username}`,
            });
            setProfileData(res.data);
        } catch (err) {
            ErrorQueueClass.handleError(err);
        }
    };

    React.useEffect(() => {
        fetchUserData();
    }, [username]);

    const profileHeaderData: ProfileDataProps | null = profileData && {
        username: username,
        joinedDate: profileData.date_joined,
        friendsCount: profileData.total_friends,
        gamesCount: profileData.total_games,
    };

    return (
        <>
            <UserMenu />

            <Paper customCss={ProfileCss} white={true} elevation={1}>
                {profileHeaderData && <ProfileHeader data={profileHeaderData} />}
                <UserInteractions
                    friendStatus={(profileData && profileData.friend_status) || null}
                    username={username}
                />
                <RecentGames games={profileData && profileData.games} />
            </Paper>
        </>
    );
}
