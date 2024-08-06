/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const errorMessageCss = css`
	background-color: rgb(229, 143, 143, 0.9);
	padding: 1em;
	margin: 1em 0;
	border: solid thin #8a0000;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #8a0000;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: bold;
	box-sizing: border-box;
	width: 100%;
	cursor: pointer;
`;

type Props = { message: string; setErrorMessage: (message: string) => void };
export default function ErrorMessage(props: Props) {
	const handleRemove = () => {
		props.setErrorMessage("");
	};

	return (
		<div css={errorMessageCss} onClick={handleRemove}>
			{props.message}
		</div>
	);
}
