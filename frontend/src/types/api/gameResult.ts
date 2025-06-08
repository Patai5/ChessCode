import { GameTermination, GameWinner } from "./game";

export type GameResultApiResponse = {
    winner: GameWinner;
    termination: GameTermination;
};
