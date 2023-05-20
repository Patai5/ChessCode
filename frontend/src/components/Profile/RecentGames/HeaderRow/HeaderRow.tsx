/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const HeaderRowCss = css`
    background-color: #3d3d3d;

    td {
        padding: 0.5em;
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
