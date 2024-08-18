/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const loadingCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: white;
`;

type Props = {
    /**
     * The text to display while loading/connecting.
     * @default "Loading"
     */
    displayText?: string;
};

export default function Loading(props: Props) {
    const { displayText = "Loading" } = props;

    // TODO: Improve visual design
    return <div css={loadingCss}>{displayText}...</div>;
}
