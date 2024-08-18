import { css } from "@emotion/react";

const Icon = css`
    text-align: center;
    font: icon;
    font-family: "Lexend Deca", sans-serif;
`;

const Button = css`
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
    transition-property: background, box-shadow, color;

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

const Container = css`
    position: relative;
`;

const PressedButton = css`
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

const Highlighted = css`
    color: #fc9701;
`;

const Enabled = css`
    :hover {
        background: rgb(50, 50, 50);
        box-shadow: var(--box-shadow), inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;
const Disabled = css`
    opacity: 0.5;
    cursor: default;
`;

export const Styles = {
    Icon,
    Button,
    Container,
    PressedButton,
    Highlighted,
    Enabled,
    Disabled,
} as const;
