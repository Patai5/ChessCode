import { GAME_TERMINATION, GAME_WINNER } from "types/api/game";

export const ANIMATION_STATE = {
    OPENING: "OPENING",
    OPEN: "OPEN",
    CLOSING: "CLOSING",
    CLOSED: "CLOSED",
} as const;

export type AnimationState = keyof typeof ANIMATION_STATE;

export const GAME_WINNER_TITLE = {
    [GAME_WINNER.WHITE]: "White has Won!",
    [GAME_WINNER.BLACK]: "Black has Won!",
    [GAME_WINNER.DRAW]: "It's a Draw!",
} as const;

export const GAME_TERMINATION_EXPLANATION = {
    [GAME_TERMINATION.CHECKMATE]: "by checkmate",
    [GAME_TERMINATION.STALEMATE]: "by stalemate",
    [GAME_TERMINATION.INSUFFICIENT_MATERIAL]: "by insufficient material",
    [GAME_TERMINATION.FIFTY_MOVES]: "by fifty moves rule",
    [GAME_TERMINATION.THREEFOLD_REPETITION]: "by threefold repetition",
    [GAME_TERMINATION.TIMEOUT]: "on time",
    [GAME_TERMINATION.RESIGNATION]: "by resignation",
    [GAME_TERMINATION.AGREEMENT]: "by mutual agreement",
    [GAME_TERMINATION.ABORTED]: "Game aborted",
} as const;
