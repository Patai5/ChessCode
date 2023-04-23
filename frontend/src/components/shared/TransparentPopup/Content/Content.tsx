/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import { IconType } from "react-icons/lib";

const IconDivCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const IconCss = css`
    font-size: 2.85em;
`;
const IconTextCss = css`
    font-size: 1em;
    margin: 0;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
`;

const TitleCss = css`
    margin: 0;
    font-family: "Lexend Deca";
    font-weight: 700;
    font-size: 1.4em;
`;
const DescriptionCss = css`
    font-family: "Montserrat";
    font-weight: 300;
    font-style: normal;
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
`;

export interface Content {
    icon?: IconType;
    iconText?: string;
    title?: string;
    description?: string;
}
type Props = { content: Content };
export default function Content(props: Props) {
    return (
        <>
            <div css={IconDivCss}>
                {props.content.icon && <props.content.icon css={IconCss} />}
                <h2 css={IconTextCss}>{props.content.iconText}</h2>
            </div>
            <h1 css={TitleCss}>{props.content.title}</h1>
            <p css={DescriptionCss}>{props.content.description}</p>
        </>
    );
}
