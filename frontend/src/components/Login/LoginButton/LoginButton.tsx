/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const buttonCss = css`
	width: 7em;
	height: 2.125em;
	margin: 1.25em 0;
	border-radius: 0.5em;
	border: none;
	box-shadow: 0 0.1em 0.1em rgb(0 0 0 / 25%);
	font-size: 2.5em;
	color: white;
	font-family: "Lexend Deca", sans-serif;
	background: linear-gradient(90deg, #00763f 50%, #006f72 100%);
	background-position: 100% 0;
	transition: background 0.5s ease-out;
	background-size: 200% 100%;
	cursor: pointer;

	&:hover {
		background-position: 0 0;
	}

	&:focus {
		outline: none;
	}
`;

type Props = {
	register: boolean;
};
export default function LoginButton(props: Props) {
	return (
		<button css={buttonCss} type="submit">
			{props.register ? "Register" : "Login"}
		</button>
	);
}
