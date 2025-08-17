/** @jsxImportSource @emotion/react */
import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { css, SerializedStyles } from "@emotion/react";
import React from "react";

const AvatarCss = css`
    border-radius: 50%;
    box-shadow: 0 0 0.3em black;
    width: 2em;
    height: 2em;
`;

type Props = { username: string; customCss?: SerializedStyles };
export default function ProfilePicture(props: Props) {
    const avatar = React.useMemo(() => {
        return createAvatar(identicon, {
            size: 128,
            seed: props.username,
            scale: 90,
            radius: 50,
            backgroundType: ["solid", "gradientLinear"],
            backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
        }).toDataUri();
    }, [props.username]);

    return <img css={[AvatarCss, props.customCss]} src={avatar} alt="avatar" />;
}
