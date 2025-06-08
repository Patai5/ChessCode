import { Statuses } from "types/friendStatuses";
import { GameApiResponse } from "./game";

export type ProfileApiResponse = {
    date_joined: string;
    games: GameApiResponse[];
    total_games: number;
    total_friends: number;
    friend_status?: Statuses;
    friend_requests?: number;
};
