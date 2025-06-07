/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { MdClose } from "react-icons/md";

const CloseButtonCss = css`
    position: absolute;
    top: -0.3em;
    right: -0.3em;

    cursor: pointer;
    border-radius: 1em;
    padding: 0.1em;
    background: #822a8d;
`;

type Props = { onClick: () => void };

export default function CloseButton(props: Props) {
    return <MdClose css={CloseButtonCss} onClick={props.onClick} />;
}
