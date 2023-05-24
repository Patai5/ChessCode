/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const HeaderRowCss = css`
    background-color: #252525;
    color: #b0b0b0;

    td {
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-weight: 400;
        font-size: 0.85em;
        padding: 0.8em;
    }
`;

type Props = {};
export default function HeaderRow(props: Props) {
    return (
        <thead>
            <tr css={HeaderRowCss}>
                <td>Opponent</td>
                <td>Result</td>
                <td>Time Control</td>
                <td>Date</td>
            </tr>
        </thead>
    );
}
