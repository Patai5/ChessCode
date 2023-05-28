/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "components/shared/Button";
import useFriendsButton from "hooks/useFriendsButton";
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
    const { friendStatus, handleFriendsOnClick, confirmPopup } = useFriendsButton(props.friendStatus, props.username);

    return (
        <div css={InteractionsCss}>
            {confirmPopup}
            {friendStatus && (
                <Button icon={friendStatus.icon} label={friendStatus.text} onClick={handleFriendsOnClick} />
            )}
            {friendStatus && <Button label="Play" />}
        </div>
    );
}
