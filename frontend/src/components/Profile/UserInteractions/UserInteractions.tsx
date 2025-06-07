/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "components/shared/Button";
import FindGame from "components/shared/FindGame/FindGame";
import useFriendsButton from "hooks/useFriendsButton";
import React from "react";
import { Statuses } from "types/friendStatuses";

const InteractionsCss = css`
    display: flex;
    justify-content: center;
    gap: 1em;
    padding: 1em;
    margin-bottom: 1em;
`;

type Props = { friendStatus: Statuses | null; username: string };

export default function UserInteractions(props: Props) {
    const { username } = props;

    const { friendStatus, handleFriendsOnClick, confirmPopup } = useFriendsButton(props.friendStatus, username);

    const [isFindGamePopupOpen, setIsFindGamePopupOpen] = React.useState(false);
    const closeFindGamePopup = () => setIsFindGamePopupOpen(false);

    React.useEffect(() => {
        // Reset the find game popup state when the username changes
        setIsFindGamePopupOpen(false);
    }, [username]);

    return (
        <div css={InteractionsCss}>
            {confirmPopup}
            {friendStatus && (
                <Button icon={friendStatus.icon} label={friendStatus.text} onClick={handleFriendsOnClick} />
            )}
            {friendStatus && <Button label="Play" onClick={() => setIsFindGamePopupOpen(true)} />}
            {isFindGamePopupOpen && <FindGame playAgainstPlayer={username} closeFindGamePopup={closeFindGamePopup} />}
        </div>
    );
}
