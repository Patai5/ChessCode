/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import { ReactElement } from "react";
import { IconType } from "react-icons";

const MainCss = css`
    display: flex;
    flex-direction: row;
    gap: 0.75em;
    justify-content: center;
    align-items: center;
    padding: 0.7em 1em;
    transition: box-shadow 0.2s ease-in-out;
    border-radius: inherit;
`;
const HoverCss = css`
    cursor: pointer;
    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;
const TextCss = css`
    margin: 0;
    align-self: center;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 600;
`;

export type Props = {
    icon?: IconType;
    image?: ReactElement;
    text: string;
    onClick?: () => void;
    customCss?: SerializedStyles;
    textCss?: SerializedStyles;
    iconCss?: SerializedStyles;
    isActive?: boolean;
};
export default function Main(props: Props) {
    return (
        <div css={[MainCss, props.isActive && HoverCss, props.customCss]} onClick={props.onClick}>
            {props.icon ? <props.icon css={props.iconCss} /> : props.image}
            <span css={[TextCss, props.textCss]}>{props.text}</span>
        </div>
    );
}
