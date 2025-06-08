import { GAME_WINNER } from "./api/game";

export const GAME_OUTCOME = {
    WON: "WON",
    LOST: "LOST",
    DRAW: "DRAW",
} as const;
export type GameOutcome = keyof typeof GAME_OUTCOME;

export type PlayerInfo = {
    username: string;
    color: PlayerColor;
};

export type PlayerColor = typeof GAME_WINNER.WHITE | typeof GAME_WINNER.BLACK;
