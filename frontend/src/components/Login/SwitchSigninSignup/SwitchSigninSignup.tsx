/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

const switchContainerCss = css`
	color: rgb(255, 255, 255, 0.75);
	display: flex;
	justify-content: space-between;
	width: calc(100% - 1.5em);
`;
const linkCss = css`
	color: #097a82;
	text-decoration: none;
`;
const bothCss = css`
	font-family: "Montserrat", sans-serif;
	font-weight: 500;
	margin: 0;
`;

type Props = { register: boolean };
export default function SwitchSigninSignup(props: Props) {
	return (
		<div css={switchContainerCss}>
			<p css={bothCss}>{!props.register && "Not a member yet? "}</p>
			<Link
				css={[bothCss, linkCss]}
				to={!props.register ? "/signup" : "/login"}
			>
				{!props.register
					? "Create new account"
					: "Already have an account"}
			</Link>
		</div>
	);
}
