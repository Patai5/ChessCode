/** @jsxImportSource @emotion/react */
import Paper from "components/shared/Paper";
import ProfilePicture from "components/shared/ProfilePicture";
import { formatDateString } from "utils/utils";

export type ProfileDataProps = { username: string; joinedDate: string; friendsCount: number; gamesCount: number };

type Props = { data: ProfileDataProps | null };
export default function ProfileHeader(props: Props) {
    if (!props.data) return null;

    return (
        <Paper>
            <ProfilePicture username={props.data.username} />
            <h1>{props.data.username}</h1>
            <p>Joined: {formatDateString(props.data.joinedDate)}</p>
            <p>Friends: {props.data.friendsCount}</p>
            <p>Games: {props.data.gamesCount}</p>
        </Paper>
    );
}
