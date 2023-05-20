/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { GameTermination, GameWinner } from "components/Play/Chess/ResultsDisplay/ResultsDisplay";
import { formatDateString, secToTime } from "utils/utils";

const GameRowCss = css`
    background-color: #3d3d3d;

    td {
        padding: 0.5em;
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

type Props = { game: Game; username: string };
export default function GameRow(props: Props) {
    const userColor = props.game.player_white === props.username ? "white" : "black";
    const opponentUsername = userColor === "white" ? props.game.player_black : props.game.player_white;

    const wonLost =
        props.game.winner_color === "draw" ? "Draw" : props.game.winner_color === userColor ? "Won" : "Lost";
    const resultText = GameTermination[props.game.termination];

    const timeControl = secToTime(props.game.time_control);

    const dateString = formatDateString(props.game.date);

    return (
        <tr css={GameRowCss}>
            <td>{opponentUsername}</td>
            <td>
                <span css={WinnerColorsCss[wonLost]}>{wonLost} </span>
                {resultText}
            </td>
            <td>{timeControl}</td>
            <td>{dateString}</td>
        </tr>
    );
}
