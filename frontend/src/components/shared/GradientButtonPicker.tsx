/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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

export interface GradientButtonPickerMethods {
    resetButtons: () => void;
}

export type ButtonGroup = {
    ref: React.MutableRefObject<GradientButtonPickerMethods | null>;
    buttons: Button[];
};

export interface Button {
    name: string;
    onSelect?: () => void;
    onDeSelect?: () => void;
    isTitle?: boolean;
}

type Props = { backgroundColors: [string, string]; buttons: Button[]; hasTitle?: boolean; disabled?: boolean };
const GradientButtonPicker = React.forwardRef((props: Props, ref: React.Ref<GradientButtonPickerMethods>) => {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const gradientColumns = props.buttons.length * 2 - 1;
    const highlightedIndex = hoveredIndex === 0 ? 0 : hoveredIndex || selectedIndex || 0;

    const handleClicked = (index: number) => {
        const button = props.buttons[index];

        if (selectedIndex !== index) {
            setSelectedIndex(index);
            if (button.onSelect) button.onSelect();
        } else {
            setSelectedIndex(null);
            if (button.onDeSelect) button.onDeSelect();
        }
    };

    const resetButtons = () => {
        setSelectedIndex(null);
    };

    React.useImperativeHandle(ref, () => ({
        resetButtons: resetButtons,
    }));

    const backgroundCss = css`
        background: linear-gradient(
            90deg,
            ${props.backgroundColors[1]},
            ${props.backgroundColors[0]} ${(100 / gradientColumns) * (props.buttons.length - 1)}%,
            ${props.backgroundColors[0]} ${(100 / gradientColumns) * props.buttons.length}%,
            ${props.backgroundColors[1]}
        );
        background-size: ${gradientColumns * 100}% 100%;
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

    const getButtonCss = (button: Button, index: number) => {
        const backgroundPositionCss = css`
            background-position: ${(100 / (gradientColumns - 1)) *
                (props.buttons.length - 1 + index - highlightedIndex)}%
                0%;
        `;

        return [
            gradientButtonCss,
            backgroundCss,
            props.buttons.length === 2 && backgroundForTwo,
            backgroundPositionCss,
            button.isTitle && titleButtonCss,
            index === hoveredIndex && highlightedButtonCss,
            [highlightedIndex, selectedIndex].every((val) => val === index) && [
                highlightedButtonCss,
                selectedButtonCss,
            ],
            props.disabled && disabledCss,
        ];
    };

    const getButtonElement = (button: Button, index: number) => {
        return (
            <span
                css={getButtonCss(button, index)}
                key={index}
                {...(!button.isTitle && {
                    onMouseLeave: () => setHoveredIndex(null),
                    ...(!props.disabled && {
                        onMouseEnter: () => setHoveredIndex(index),
                        onClick: () => {
                            handleClicked(index);
                        },
                    }),
                })}
            >
                {button.name}
            </span>
        );
    };

    return (
        <div css={[gradientButtonPickerCss]}>
            {props.buttons.map((button, index) => {
                return getButtonElement(button, index);
            })}
        </div>
    );
});

export default GradientButtonPicker;
