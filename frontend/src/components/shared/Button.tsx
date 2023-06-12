/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { SerializedStyles } from "@emotion/utils";
import { IconType } from "react-icons";

const ButtonCss = css`
    display: flex;
    align-items: center;
    gap: 1em;

    border-radius: 2em;
    padding: 0.5em 3.1em;
    border: none;
    cursor: pointer;
    background-color: #ffffff26;

    transition: box-shadow 0.5s ease;

    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;
const LabelCss = css`
    color: #ffffff;
    font-family: "Lexend Deca", sans-serif;

    margin: 0;
`;
const IconButtonCss = css`
    padding-left: 2.1em;
`;
const IconCss = css`
    width: 1.25em;
    height: 1.25em;
`;

type Props = {
    label: string;
    onClick?: () => void;
    icon?: IconType;
    fontSize?: string;
    customCss?: SerializedStyles;
};
export default function Button(props: Props) {
    const { onClick = () => {}, fontSize = "1em" } = props;

    const handleOnClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onClick();
    };

    const fontSizeCss = {
        fontSize: fontSize,
    };

    return (
        <span css={[ButtonCss, props.icon && IconButtonCss, props.customCss]} onClick={handleOnClick}>
            {props.icon && <props.icon css={IconCss} />}
            <p css={LabelCss} style={fontSizeCss}>
                {props.label}
            </p>
        </span>
    );
}
