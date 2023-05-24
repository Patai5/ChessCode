/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Paper from "components/shared/Paper";
import useWindowSize from "hooks/useWindowSize";
import GameRow, { Game } from "./GameRow/GameRow";
import HeaderRow from "./HeaderRow/HeaderRow";

const TitleCss = css`
    margin: 0;
    padding: 0.5em;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 600;
`;

const GamesTableCss = css`
    color: white;
    width: 100%;
    border-collapse: collapse;
    border-radius: 0.35em;
    background-color: #3d3d3d;
    overflow: hidden;
    border: 2px solid #ffffff;

    > * > tr > td {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: left;

        font-family: "Montserrat", sans-serif;

        :nth-of-type(1) {
            max-width: 10em;
        }

        @media (max-width: 600px) {
            :nth-of-type(3) {
                display: none;
            }
        }
    }
`;

type Props = { games: Game[] | null; username: string };
export default function RecentGames(props: Props) {
    const size = useWindowSize();
    if (size.width === undefined) return null;

    return (
        <Paper elevation={1} white={true}>
            <h2 css={TitleCss}>Recent Games</h2>
            <table css={GamesTableCss}>
                <HeaderRow />
                <tbody>
                    {props.games &&
                        props.games.map((game, index) => (
                            <GameRow key={index} game={game} username={props.username} width={size.width!} />
                        ))}
                </tbody>
            </table>
        </Paper>
    );
}
