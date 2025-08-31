/** @jsxImportSource @emotion/react */
import { PATHS } from "components/constants";
import ProfilePicture from "components/shared/ProfilePicture";
import React from "react";
import { IoIosGlobe } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { PlayerApi, RegisteredPlayerApi } from "types/api/player";
import { CSS } from "./css";

type Props = {
    opponent: PlayerApi;
    setIsOpponentButtonHovered: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OpponentUserButton(props: Props) {
    const { opponent, setIsOpponentButtonHovered } = props;

    const navigate = useNavigate();

    const handleOpponentOnClick = (event: React.MouseEvent) => {
        if (!isOpponentRegistered) return;

        event.stopPropagation();
        navigate(PATHS.PROFILE(opponent.username));
    };

    const isOpponentRegistered = opponent.user_type !== "anonymous";
    const OpponentDisplay = isOpponentRegistered
        ? getRegisteredOpponentDisplay(opponent)
        : getAnonymousOpponentDisplay();

    return (
        <td
            css={isOpponentRegistered && CSS.OPPONENT_PROFILE_BUTTON}
            onClick={handleOpponentOnClick}
            onMouseEnter={() => isOpponentRegistered && setIsOpponentButtonHovered(true)}
            onMouseLeave={() => isOpponentRegistered && setIsOpponentButtonHovered(false)}
            data-testid={`opponent-user-button`}
        >
            {OpponentDisplay}
        </td>
    );
}

const getRegisteredOpponentDisplay = (opponent: RegisteredPlayerApi) => {
    return (
        <div css={CSS.OPPONENT_USER_WRAPPER}>
            <ProfilePicture username={opponent.username} customCss={CSS.PROFILE_PICTURE_ICON} />
            {opponent.username}
        </div>
    );
};

const getAnonymousOpponentDisplay = () => {
    return (
        <div css={CSS.OPPONENT_USER_WRAPPER}>
            <IoIosGlobe css={CSS.ANONYMOUS_USER_ICON} />
            Anonymous
        </div>
    );
};
