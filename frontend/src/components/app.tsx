/** @jsxImportSource @emotion/react */
import { Global, css } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import Friends from "./Friends/Friends";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Play from "./Play/Play";
import Profile from "./Profile/Profile";
import ErrorQueue from "./shared/ErrorQueue/ErrorQueue";

const globalCss = css`
    body {
        font-size: calc(15px + 0.390625vw);
        background-color: #121212;
        margin: 0;
    }
`;

type Props = {};
export default function app(props: Props) {
    return (
        <>
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
        </>
    );
}
