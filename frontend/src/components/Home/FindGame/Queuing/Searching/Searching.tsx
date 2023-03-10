/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { FaSearch } from "react-icons/fa";

const searchingCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const iconCss = css`
    font-size: 2.85em;
`;
const h2Css = css`
    font-size: 1em;
    margin: 0;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
`;

type Props = {};
export default function Searching(props: Props) {
    const [dotCount, setDotCount] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((count) => (count + 1) % 4);
        }, 400);
        return () => clearInterval(interval);
    });

    return (
        <div css={searchingCss}>
            <FaSearch css={iconCss} />
            <h2 css={h2Css}>Searching{".".repeat(dotCount)}</h2>
        </div>
    );
}
