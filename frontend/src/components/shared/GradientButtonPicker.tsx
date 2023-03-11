/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";

const gradientButtonPickerCss = css`
    display: flex;
    width: 100%;
    filter: drop-shadow(0px 0.175em 0.175em rgba(0, 0, 0, 0.25));
    border-radius: 0.65em;
    overflow: hidden;
`;

const gradientButtonCss = css`
    background: transparent;
    cursor: pointer;
    border: none;
    font-family: "Lexend Deca", sans-serif;
    padding: 0.65em;
    flex: 1 1 0px;
    text-align: center;
    margin: auto;
    width: 100%;
    font-size: 1.05em;
    border-left: 1px solid rgba(0, 0, 0, 0.5);
    transition: all 0.5s ease;
    transition-property: background-position, box-shadow, filter;

    :first-of-type {
        border-right: 1px solid rgba(0, 0, 0, 0.5);
        border-left: none;
    }
`;

const titleButtonCss = css`
    font-weight: 600;
    cursor: default;
    :hover {
        box-shadow: none;
    }
`;

const highlightedButtonCss = css`
    filter: saturate(1.2);
    filter: brightness(1.2);

    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;

const selectedButtonCss = css`
    :hover {
        box-shadow: none;
    }
`;

const disabledCss = css`
    cursor: default;
`;

export interface Item {
    name: string;
    callback?: () => void;
    isTitle?: boolean;
}

type Props = { backgroundColors: [string, string]; items: Item[]; hasTitle?: boolean; disabled?: boolean };
export default function GradientButtonPicker(props: Props) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const gradiantColumns = props.items.length * 2 - 1;
    const highlightedIndex = hoveredIndex === 0 ? 0 : hoveredIndex || selectedIndex || 0;

    const backgroundCss = css`
        background: linear-gradient(
            90deg,
            ${props.backgroundColors[1]},
            ${props.backgroundColors[0]} ${(100 / gradiantColumns) * (props.items.length - 1)}%,
            ${props.backgroundColors[0]} ${(100 / gradiantColumns) * props.items.length}%,
            ${props.backgroundColors[1]}
        );
        background-size: ${gradiantColumns * 100}% 100%;
    `;
    const backgroundForTwo = css`
        background-size: 200% 100%;
        :nth-of-type(1) {
            background-image: linear-gradient(90deg, ${props.backgroundColors[0]}, ${props.backgroundColors[1]} 50%);
            :hover {
                background-position: 100% 0%;
            }
        }
        :nth-of-type(2) {
            background-image: linear-gradient(90deg, ${props.backgroundColors[1]} 50%, ${props.backgroundColors[0]});
            :hover {
                background-position: 0% 0%;
            }
        }
    `;

    return (
        <div css={[gradientButtonPickerCss]}>
            {props.items.map((item, index) => {
                const backgroundPositionCss = css`
                    background-position: ${(100 / (gradiantColumns - 1)) *
                        (props.items.length - 1 + index - highlightedIndex)}%
                        0%;
                `;
                const cssArray = [
                    gradientButtonCss,
                    backgroundCss,
                    props.items.length === 2 && backgroundForTwo,
                    backgroundPositionCss,
                    item.isTitle && titleButtonCss,
                    index === hoveredIndex && highlightedButtonCss,
                    [highlightedIndex, selectedIndex].every((val) => val === index) && [
                        highlightedButtonCss,
                        selectedButtonCss,
                    ],
                    props.disabled && disabledCss,
                ];

                return (
                    <span
                        css={cssArray}
                        key={index}
                        {...(!item.isTitle &&
                            !props.disabled && {
                                onMouseLeave: () => setHoveredIndex(null),
                                onMouseEnter: () => setHoveredIndex(index),
                                onClick: () => {
                                    setSelectedIndex(index);
                                    item.callback();
                                },
                            })}
                    >
                        {item.name}
                    </span>
                );
            })}
        </div>
    );
}
