export const PATHS = {
    HOME: "/",
    PLAY: "/play",
    LOGIN: "/login",
    REGISTER: "/register",
    FRIENDS: "/friends",
    PROFILE: (username: string) => `/profile/${username}`,
} as const;
