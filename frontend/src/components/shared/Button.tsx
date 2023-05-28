/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { IconType } from "react-icons";

const ButtonCss = css`
    display: flex;
    align-items: center;
    gap: 1em;

    border-radius: 2em;
    padding: 0.5em 3.1em;
    border: none;
    cursor: pointer;

    transition: all 0.5s ease;
    transition-property: background-position, box-shadow;

    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;
const LabelCss = css`
    color: #ffffff;
    font-family: "Lexend Deca", sans-serif;

    margin: 0;
`;
const IconCss = css`
    width: 1.25em;
    height: 1.25em;
    margin-left: -1em;
`;

type Props = { label: string; onClick?: () => void; icon?: IconType; color?: string; fontSize?: string };
export default function Button(props: Props) {
    const { color = "#ffffff26", onClick = () => {}, fontSize = "1em" } = props;

    const backgroundColorCss = {
        background: color,
    };
    const fontSizeCss = {
        fontSize: fontSize,
    };

    return (
        <span css={ButtonCss} style={backgroundColorCss} onClick={onClick}>
            {props.icon && <props.icon css={IconCss} />}
            <p css={LabelCss} style={fontSizeCss}>
                {props.label}
            </p>
        </span>
    );
}
