/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";

const responseTextCss = css`
	font-family: "Lexend Deca", sans-serif;
	font-size: 0.8em;
	color: #ec6250;
	margin: 0.5em 0 -1em;
	text-align: center;
`;

type Props = {
	type: "username" | "password";
	value: string;
};
export default function ResponseText(props: Props) {
	const response = () => {
		if (props.type == "username") {
			return "Username can only contain letters, numbers, and underscores \
					and must be between 3 and 15 characters long.";
		} else {
			return "Password should have at least 8 characters, one lower and \
					upper case letter, one number and one special character.";
		}
	};

	const shouldShowResponse = () => {
		if (props.type == "username") {
			const properUsernameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
			if (props.value.match(properUsernameRegex)) return false;
			return true;
		} else {
			const properPasswordRegex =
				/^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			if (props.value.match(properPasswordRegex)) return false;
			return true;
		}
	};

	return (
		<>
			{shouldShowResponse() && (
				<div css={responseTextCss}>{response()}</div>
			)}
		</>
	);
}
