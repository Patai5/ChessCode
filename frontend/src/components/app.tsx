/** @jsxImportSource @emotion/react */
import { Global, css, jsx } from "@emotion/react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Home from "./Home/Home";
import ErrorQueue from "./shared/ErrorQueue/ErrorQueue";

const globalCss = css`
    body {
        font-size: calc(15px + 0.390625vw);
        background-color: #121212;
        margin: 0;
        overflow: hidden;
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
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    );
}
