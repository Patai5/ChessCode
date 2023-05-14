/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Display from "./Display/Display";

const MenuCss = css`
    float: right;
    border-radius: 0 0 0 1em;
    box-shadow: 0 0 0.5em #000000ab;

    background-color: #3636367d;
    padding: 0.5em;
    cursor: pointer;
`;

type Props = {};
export default function UserMenu(props: Props) {
    const clientUsername = localStorage.getItem("username");

    return (
        <div css={MenuCss}>
            <Display username={clientUsername} />
        </div>
    );
}
