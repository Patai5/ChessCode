/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { GameWinner } from "components/Play/Chess/ResultsDisplay/ResultsDisplay";
import { GameTermination } from "components/Play/Chess/ResultsDisplay/ResultsDisplay";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDateString, secToTime } from "utils/utils";

const GameRowCss = css`
    background-color: #3d3d3d;
    cursor: pointer;
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    td {
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.5em;
    }
`;
const HoverEnabledCss = css`
    :hover {
        background-color: #4d4d4d;
        td {
            border-right: 1px solid rgba(255, 255, 255, 0);
        }
    }
`;
const UsernameCss = css`
    :hover {
        text-decoration: underline;
        background-color: #4d4d4d;
    }
`;
const WinnerColorsCss = {
    Won: css`
        color: #00ff00;
    `,
    Lost: css`
        color: #ff0000;
    `,
    Draw: css`
        color: #b0b0b0;
    `,
};

export interface Game {
    game_id: number;
    player_white: string;
    player_black: string;
    termination: keyof typeof GameTermination;
    winner_color: keyof typeof GameWinner;
    time_control: number;
    date: string;
}

type Props = { game: Game; username: string; width: number };
export default function GameRow(props: Props) {
    const [userHovered, setUserHovered] = React.useState(false);
    const navigate = useNavigate();

    const handleUserOnClick = () => {
        navigate(`/profile/${opponentUsername}`);
    };

    const displayResultLong = props.width > 800;
    const userColor = props.game.player_white === props.username ? "white" : "black";
    const opponentUsername = userColor === "white" ? props.game.player_black : props.game.player_white;

    const wonLost =
        props.game.winner_color === "draw" ? "Draw" : props.game.winner_color === userColor ? "Won" : "Lost";
    const resultText = GameTermination[props.game.termination];

    const timeControl = secToTime(props.game.time_control);

    const dateString = formatDateString(props.game.date);

    return (
        <tr css={[GameRowCss, !userHovered && HoverEnabledCss]}>
            <td
                css={UsernameCss}
                onClick={handleUserOnClick}
                onMouseEnter={() => setUserHovered(true)}
                onMouseLeave={() => setUserHovered(false)}
            >
                {opponentUsername}
            </td>
            <td>
                <span css={WinnerColorsCss[wonLost]}>{wonLost}</span>
                {displayResultLong && ` ${resultText}`}
            </td>
            <td>{timeControl}</td>
            <td>{dateString}</td>
        </tr>
    );
}
