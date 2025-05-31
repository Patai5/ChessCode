import { css } from "@emotion/react";
import Paper from "components/shared/Paper";
import { Friends } from "types/friendStatuses";
import Friend from "./Friend/Friend";

const FriendsCss = css`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin: 0.4em;
    padding: 0.8em;
    box-shadow: 0 0.1em 0.1em rgba(0, 0, 0, 0.25);
`;

type Props = { friends: Friends };
export default function FriendsTable(props: Props) {
    const { friends } = props;

    return (
        <Paper customCss={FriendsCss} elevation={4}>
            {Object.entries(friends).map(([username, friendStatus]) => (
                <Friend username={username} friendStatus={friendStatus} key={username} />
            ))}
        </Paper>
    );
}
