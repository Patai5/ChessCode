import { Color } from "components/shared/Chess/ChessBoard/ChessLogic/pieces";

export type PlayersApi = PlayersApiGeneric<PlayerApi>;
export type GamePlayersApi = PlayersApiGeneric<GamePlayerApi>;

type PlayersApiGeneric<T> = {
    [key in Color]: T;
};

export type PlayerApi = (RegisteredPlayerApi | AnonymousPlayerApi) & {
    is_current_user?: boolean;
    status?: "friends" | "not_friends" | "friend_request_sent" | "friend_request_received";
};

export type GamePlayerApi = PlayerApi & {
    time: number;
};

export type RegisteredPlayerApi = {
    user_type: "registered";
    username: string;
};

type AnonymousPlayerApi = {
    user_type: "anonymous";
    user_id: number;
};
