import { Statuses } from "types/friendStatuses";
import { SimpleGameApiResponse } from "./game";

export type ProfileApiResponse = {
    date_joined: string;
    games: SimpleGameApiResponse[];
    total_games: number;
    total_friends: number;
    friend_status?: Statuses;
    friend_requests?: number;
};
