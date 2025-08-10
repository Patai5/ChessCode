import { MoveName } from "components/shared/Chess/ChessBoard/ChessLogic/board";
import { GameTermination, GameWinner } from "./game";
import { GamePlayersApi } from "./player";

export type ReplayGameAPIResponse = {
    moves: MoveName[];
    players: GamePlayersApi;
    termination: GameTermination;
    date: Date;
    winner_color: GameWinner;
};
