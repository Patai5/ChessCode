/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { IconType } from "react-icons/lib";

const ItemCss = css`
    display: flex;
    gap: 1em;
    color: white;
    cursor: pointer;
    align-items: center;

    padding: 0.75em;
    padding-inline: 1em 3em;
    overflow: hidden;

    transition: 0.25s ease-in-out;
    transition-property: box-shadow, background-color;

    font-family: "Lexend Deca", sans-serif;
    font-weight: 400;

    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

type Props = {
    icon: IconType;
    text: string;
    onClick: () => void;
};
export default function Item(props: Props) {
    return (
        <div css={ItemCss} onClick={props.onClick}>
            <props.icon />
            <span>{props.text}</span>
        </div>
    );
}
