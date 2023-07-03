/** @jsxImportSource @emotion/react */
import { Global, css } from "@emotion/react";
import axios, { AxiosError } from "axios";
import { AppContext } from "hooks/appContext";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Friends from "./Friends/Friends";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Play from "./Play/Play";
import Profile from "./Profile/Profile";
import ErrorQueue, { ErrorQueueClass } from "./shared/ErrorQueue/ErrorQueue";

const globalCss = css`
    body {
        font-size: calc(15px + 0.390625vw);
        background-color: #121212;
        margin: 0;
    }
`;

type Props = {};
export default function app(props: Props) {
    const [username, setUsername] = React.useState<string | null>(null);

    const handleSetUsername = (username: string | null) => {
        setUsername(username);

        if (username) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
        }
    };

    React.useEffect(() => {
        const username = localStorage.getItem("username");
        setUsername(username);

        const removeUsernameOnRetiredSession = async () => {
            const isAuthenticated = await getIsAuthenticated();
            if (!isAuthenticated) handleSetUsername(null);
        };
        removeUsernameOnRetiredSession();
    }, []);

    const getIsAuthenticated = async (): Promise<boolean | AxiosError> => {
        try {
            const res = await axios({
                method: "get",
                url: "/api/auth/is_authenticated",
            });
            return res.data["is_authenticated"];
        } catch (err) {
            ErrorQueueClass.handleError(err);
            return err;
        }
    };

    return (
        <AppContext.Provider value={{ username, setUsername: handleSetUsername }}>
            <ErrorQueue />
            <Global styles={globalCss} />
            <Routes>
                <Route path="/login" element={<Login register={false} />} />
                <Route path="/signup" element={<Login register={true} />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/friends/:username" element={<Friends />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/play/:id" element={<Play />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </AppContext.Provider>
    );
}
