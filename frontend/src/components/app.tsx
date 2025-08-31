/** @jsxImportSource @emotion/react */
import { Global, css } from "@emotion/react";
import axios, { AxiosError } from "axios";
import { AppContext } from "hooks/appContext";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { PATHS } from "./constants";
import Friends from "./Friends/Friends";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Play from "./Play/Play";
import Profile from "./Profile/Profile";
import { ReplayGame } from "./ReplayGame/ReplayGame";
import ErrorQueue, { ErrorQueueClass } from "./shared/ErrorQueue/ErrorQueue";

const globalCss = css`
    body {
        font-size: calc(15px + 0.390625vw);
        background-color: #121212;
        margin: 0;
    }

    #root {
        display: flex;
        height: 100%;
        flex-direction: column;
    }
`;

export default function app() {
    const [username, setUsername] = React.useState<string | null>(null);
    const isFirstRun = React.useRef(false);

    const handleSetUsername = (username: string | null) => {
        setUsername(username);

        if (username) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
        }
    };

    React.useEffect(() => {
        if (isFirstRun.current === true) return;
        else isFirstRun.current = true;

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
                <Route path={PATHS.LOGIN} element={<Login register={false} />} />
                <Route path={PATHS.REGISTER} element={<Login register={true} />} />
                <Route path={PATHS.PROFILE(":username")} element={<Profile />} />
                <Route path={PATHS.FRIENDS({ username: ":username" })} element={<Friends />} />
                <Route path={PATHS.FRIENDS({ username: null })} element={<Friends />} />
                <Route path={PATHS.PLAY(":id")} element={<Play />} />
                <Route path={PATHS.REPLAY_GAME(":id")} element={<ReplayGame />} />
                <Route path={PATHS.HOME} element={<Home />} />
            </Routes>
        </AppContext.Provider>
    );
}
