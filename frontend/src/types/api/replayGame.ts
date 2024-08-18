import { PlayersProps } from "components/shared/Chess/Chess";
import { MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import type { GameTermination, GameWinner } from "components/shared/Chess/ResultsDisplay/ResultsDisplay";

export type ReplayGameAPIResponse = {
    moves: MoveName[];
    players: PlayersProps;
    termination: keyof typeof GameTermination;
    date: Date;
    winner_color: keyof typeof GameWinner;
};
