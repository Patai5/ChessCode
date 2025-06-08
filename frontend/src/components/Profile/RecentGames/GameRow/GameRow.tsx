/** @jsxImportSource @emotion/react */
import { GAME_TERMINATION_EXPLANATION } from "components/constants";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GAME_WINNER, GameApiResponse, GameWinner } from "types/api/game";
import { GAME_OUTCOME, GameOutcome, PlayerColor, PlayerInfo } from "types/game";
import { formatDateString, secToTime } from "utils/utils";
import { CSS } from "./css";

const GAME_OUTCOME_TEXT = {
    [GAME_OUTCOME.WON]: "Won",
    [GAME_OUTCOME.LOST]: "Lost",
    [GAME_OUTCOME.DRAW]: "Draw",
} as const;

type Props = { game: GameApiResponse; username: string; width: number };

export default function GameRow(props: Props) {
    const { game, username, width } = props;

    const [userHovered, setUserHovered] = React.useState(false);
    const navigate = useNavigate();

    const handleUserOnClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/profile/${opponent.username}`);
    };

    const handleGameOnClick = () => {
        navigate(`/replay_game/${game.game_id}`);
    };

    const displayResultLong = width > 800;

    const { player, opponent } = getPlayerInfos(game.players, username);

    const gameOutcome = getGameOutcome(game.winner_color, player.color);
    const gameOutcomeText = GAME_OUTCOME_TEXT[gameOutcome];
    const gameOutcomeTextCss = CSS.WINNER_COLORS[gameOutcome];

    const resultText = GAME_TERMINATION_EXPLANATION[game.termination];

    const timeControl = secToTime(props.game.time_control);
    const dateString = formatDateString(props.game.date);

    return (
        <tr css={[CSS.GAME_ROW, !userHovered && CSS.HOVER_ENABLED]} onClick={handleGameOnClick}>
            <td
                css={CSS.USERNAME}
                onClick={handleUserOnClick}
                onMouseEnter={() => setUserHovered(true)}
                onMouseLeave={() => setUserHovered(false)}
            >
                {opponent.username}
            </td>
            <td>
                <span css={gameOutcomeTextCss}>{gameOutcomeText}</span>
                {displayResultLong && ` ${resultText}`}
            </td>
            <td>{timeControl}</td>
            <td>{dateString}</td>
        </tr>
    );
}

/**
 * Gets the game outcome - whether the player won, lost, or drew the game.
 */
const getGameOutcome = (winnerColor: GameWinner, playerColor: PlayerColor): GameOutcome => {
    const isDraw = winnerColor === GAME_WINNER.DRAW;
    if (isDraw) return GAME_OUTCOME.DRAW;

    const playerWon = winnerColor === playerColor;
    return playerWon ? GAME_OUTCOME.WON : GAME_OUTCOME.LOST;
};

/**
 * Gets the player infos matching their username to their color, returns both player and opponent.
 */
const getPlayerInfos = (
    players: GameApiResponse["players"],
    username: string,
): { player: PlayerInfo; opponent: PlayerInfo } => {
    const isPlayerWhite = players.white.username === username;
    const playerColor = isPlayerWhite ? GAME_WINNER.WHITE : GAME_WINNER.BLACK;
    const player = getPlayerInfo(players, playerColor);

    const opponentColor = playerColor === GAME_WINNER.WHITE ? GAME_WINNER.BLACK : GAME_WINNER.WHITE;
    const opponent = getPlayerInfo(players, opponentColor);

    return { player, opponent };
};

const getPlayerInfo = (players: GameApiResponse["players"], playerColor: PlayerColor): PlayerInfo => {
    const { username } = players[playerColor];

    return { username, color: playerColor };
};
