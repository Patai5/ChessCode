/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { IconType } from "react-icons/lib";
import Tooltip from "../Tooltip";
import { Styles } from "./styles";

export type IconButtonProps = {
    Icon: IconType | string;
    onClick: () => void;
    tooltip?: string;
    fontSize?: number;
    highlighted?: boolean;
    isEnabled?: boolean;
    "data-testid"?: string;
};

/**
 * A clickable button that displays an icon.
 * - Also can have a tooltip that appears when hovered.
 */
export const IconButton = (props: IconButtonProps) => {
    const { Icon, onClick, tooltip, fontSize = 1.5, highlighted, isEnabled = true, ...rest } = props;

    const [isHovered, setIsHover] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const handleOnClick = () => {
        if (!isEnabled || isPressed) return;

        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 750);
        onClick();
    };

    const handleOnKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleOnClick();
    };

    const fontSizeCss = css`
        font-size: ${fontSize}em;
    `;

    const iconCss = [Styles.Icon, fontSizeCss];
    const buttonCss = [
        Styles.Button,
        isEnabled ? Styles.Enabled : Styles.Disabled,
        isPressed && Styles.PressedButton,
        highlighted && Styles.Highlighted,
    ];

    return (
        <div
            css={Styles.Container}
            onClick={handleOnClick}
            onKeyDown={handleOnKeyPress}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            {...rest}
            aria-disabled={!isEnabled}
            tabIndex={0}
        >
            {tooltip && <Tooltip text={tooltip} show={isHovered} />}
            <span css={buttonCss}>
                {typeof Icon === "string" ? <span css={iconCss}>{Icon}</span> : <Icon css={iconCss} />}
            </span>
        </div>
    );
};
