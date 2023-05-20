/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Paper from "components/shared/Paper";
import GameRow, { Game } from "./GameRow/GameRow";
import HeaderRow from "./HeaderRow/HeaderRow";

const GamesTableCss = css`
    color: white;
    width: 100%;
    border-collapse: collapse;

    > * > tr > td {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: left;

        :nth-of-type(1) {
            max-width: 10em;
        }
    }
`;

type Props = { games: Game[] | null; username: string };
export default function RecentGames(props: Props) {
    return (
        <Paper>
            <h2>Recent Games</h2>
            <table css={GamesTableCss}>
                <HeaderRow />
                <tbody>
                    {props.games &&
                        props.games.map((game, index) => <GameRow key={index} game={game} username={props.username} />)}
                </tbody>
            </table>
        </Paper>
    );
}
