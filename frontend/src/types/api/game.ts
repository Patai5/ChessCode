export type GameApiResponse = {
    game_id: number;
    players: { white: { username: string }; black: { username: string } };
    termination: GameTermination;
    winner_color: GameWinner;
    time_control: number;
    date: string;
};

export const GAME_WINNER = {
    WHITE: "white",
    BLACK: "black",
    DRAW: "draw",
} as const;
export type GameWinner = (typeof GAME_WINNER)[keyof typeof GAME_WINNER];

export const GAME_TERMINATION = {
    CHECKMATE: "checkmate",
    STALEMATE: "stalemate",
    INSUFFICIENT_MATERIAL: "insufficient_material",
    FIFTY_MOVES: "fifty_moves",
    THREEFOLD_REPETITION: "threefold_repetition",
    TIMEOUT: "timeout",
    RESIGNATION: "resignation",
    AGREEMENT: "agreement",
    ABORTED: "aborted",
} as const;
export type GameTermination = (typeof GAME_TERMINATION)[keyof typeof GAME_TERMINATION];
