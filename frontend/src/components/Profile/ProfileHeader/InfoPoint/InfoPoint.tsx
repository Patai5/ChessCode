/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import Tooltip from "components/shared/Tooltip";
import React from "react";
import { IconType } from "react-icons";

const InfoPointCss = css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5em;
    border-radius: 0.5em;
    height: min-content;

    transition: all 0.3s ease;
    transition-property: background-color, box-shadow;
`;
const TooltipContainerCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;
const IconCss = css`
    font-size: 1.7em;
`;
const TextCss = css`
    margin: 0.2em;
    font-family: "Roboto", sans-serif;
    font-size: 0.9em;
    font-weight: 500;
`;

const ClickableCss = css`
    cursor: pointer;
    :hover {
        background-color: rgba(255, 255, 255, 0.075);
        box-shadow: 0 0 0.3em 0.1em rgba(255, 255, 255, 0.2);
    }
`;

type Props = { icon: IconType; data: string; tooltip: string; onClick?: () => void; iconCss?: SerializedStyles };
export default function InfoPoint(props: Props) {
    const [isHovered, setIsHover] = React.useState(false);

    return (
        <div
            css={[InfoPointCss, props.onClick && ClickableCss]}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={props.onClick}
        >
            <div css={TooltipContainerCss}>
                <Tooltip text={props.tooltip} show={isHovered} />
                <props.icon css={[IconCss, props.iconCss]} />
                <p css={TextCss}>{props.data}</p>
            </div>
        </div>
    );
}
