import React from "react";

export type AppContextType = {
    username: string | null;
    setUsername: (username: string | null) => void;
};

export const AppContext = React.createContext<AppContextType>({
    username: null,
    setUsername: () => {},
});
