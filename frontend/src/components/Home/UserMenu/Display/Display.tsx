/** @jsxImportSource @emotion/react */
import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { css } from "@emotion/react";
import React from "react";

const DisplayCss = css`
    display: flex;
    flex-direction: row;
    gap: 0.75em;
    margin-inline: 0.3em;
`;
const AvatarCss = css`
    border-radius: 50%;
    box-shadow: 0 0 0.3em black;
    width: 2em;
    height: 2em;
`;
const UsernameCss = css`
    margin: 0;
    align-self: center;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;

    color: white;
`;

type Props = { username: string | null };
export default function UserMenu(props: Props) {
    const avatar = React.useMemo(() => {
        return createAvatar(identicon, {
            size: 128,
            seed: props.username || "Not logged in",
            scale: 90,
            radius: 50,
            backgroundType: ["solid", "gradientLinear"],
            backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
        }).toDataUriSync();
    }, []);

    // TODO: Not logged in should be a link to the login page
    return (
        <div css={DisplayCss}>
            {props.username && <img css={AvatarCss} src={avatar} alt="avatar" />}
            <p css={UsernameCss}>{props.username || "Not logged in"}</p>
        </div>
    );
}
