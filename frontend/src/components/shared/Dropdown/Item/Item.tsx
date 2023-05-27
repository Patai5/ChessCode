/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { IconType } from "react-icons/lib";
import { Props as MainProps } from "../Main/Main";

export const TransitionDuration = 0.25; // In seconds

const ItemCss = css`
    display: flex;
    gap: 1em;
    cursor: pointer;
    align-items: center;

    padding: 0.75em;
    padding-inline: 1em 1.75em;
    overflow: hidden;

    background-color: #3636367d;
    transition: ${TransitionDuration}s ease-in-out;
    transition-property: box-shadow, background-color;

    font-family: "Lexend Deca", sans-serif;
    font-weight: 400;

    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.1);
    }
`;
const TextCss = css`
    white-space: nowrap;
`;

export interface Props extends MainProps {
    icon: IconType;
    image?: undefined;
}

export default function Item(props: Props) {
    return (
        <div css={ItemCss} onClick={props.onClick}>
            <props.icon />
            <span css={[TextCss, props.customCss]}>{props.text}</span>
        </div>
    );
}
