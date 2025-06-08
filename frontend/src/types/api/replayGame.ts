import { PlayersProps } from "components/shared/Chess/Chess";
import { MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { GameTermination, GameWinner } from "./game";

export type ReplayGameAPIResponse = {
    moves: MoveName[];
    players: PlayersProps;
    termination: GameTermination;
    date: Date;
    winner_color: GameWinner;
};
