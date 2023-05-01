/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { IconType } from "react-icons/lib";
import Tooltip from "./Tooltip";

const IconCss = css`
    text-align: center;
    font: icon;
    font-family: "Lexend Deca", sans-serif;
`;
const ButtonCss = css`
    background: rgb(30, 30, 30);
    --box-shadow: 0.15em 0.15em 0.4em rgba(0, 0, 0, 0.25);
    --border-radius: 0.5em;
    box-shadow: var(--box-shadow);
    color: #fff;

    border-radius: var(--border-radius);
    padding: 0.35em;
    cursor: pointer;
    user-select: none;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    aspect-ratio: 1/1;
    box-sizing: border-box;

    transition: all 0.25s ease-in-out;
    transition-property: background, box-shadow;

    :hover {
        background: rgb(50, 50, 50);
        box-shadow: var(--box-shadow), inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
    :after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: var(--border-radius);

        box-shadow: 0 0 0 0 white;
        opacity: 0.25;
    }
`;
const ContainerCss = css`
    position: relative;
`;

const PressedButtonCss = css`
    transform: translate(0, 0.05em);
    cursor: default;
    :after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: var(--border-radius);

        opacity: 0;
        box-shadow: 0 0 0.2em 1em white;
        transition: all 0.5s;
        transition-property: opacity, box-shadow;
    }
`;

type Props = { icon: IconType | string; tooltip?: string; fontSize?: number; onClick: () => void };
export default function IconButton(props: Props) {
    const [isHovered, setIsHover] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const handleOnClick = () => {
        if (isPressed) return;

        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 750);
        props.onClick();
    };

    const fontSizeCss = css`
        font-size: ${props.fontSize ? props.fontSize : "1.5"}em};
    `;

    const iconCss = [IconCss, fontSizeCss];
    return (
        <div css={ContainerCss}>
            {props.tooltip && <Tooltip text={props.tooltip} show={isHovered} />}
            <span
                css={[ButtonCss, isPressed && PressedButtonCss]}
                onClick={handleOnClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {typeof props.icon === "string" ? (
                    <span css={iconCss}>{props.icon}</span>
                ) : (
                    <props.icon css={iconCss} />
                )}
            </span>
        </div>
    );
}
