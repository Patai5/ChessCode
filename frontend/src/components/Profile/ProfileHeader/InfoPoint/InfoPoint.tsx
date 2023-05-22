/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import Tooltip from "components/shared/Tooltip";
import React from "react";
import { IconType } from "react-icons";

const InfoPointCss = css`
    display: flex;
    align-items: center;
    padding: 0.5em;
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

type Props = { icon: IconType; data: string; tooltip: string; iconCss?: SerializedStyles };
export default function InfoPoint(props: Props) {
    const [isHovered, setIsHover] = React.useState(false);

    return (
        <div css={InfoPointCss} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <div css={TooltipContainerCss}>
                <Tooltip text={props.tooltip} show={isHovered} />
                <props.icon css={[IconCss, props.iconCss]} />
                <p css={TextCss}>{props.data}</p>
            </div>
        </div>
    );
}
