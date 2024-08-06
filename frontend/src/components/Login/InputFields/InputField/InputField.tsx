/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ResponseText from "./ResponseText/ResponseText";

const fieldContainerCss = css`
	display: flex;
	position: relative;
	align-items: center;
`;
const inputFieldCss = css`
	background-color: rgb(0, 0, 0, 0.1);
	border-radius: 1.75em;
	border: solid thin #0b525b;
	padding: 1em 1.5em;
	font-size: 1em;
	color: white;
	font-family: "Lexend Deca", sans-serif;
	font-weight: 500;
	width: 100%;
`;
const showPasswordCss = css`
	position: absolute;
	right: 0.75em;
	color: rgb(255, 255, 255, 0.5);
	font-size: 1.5em;
	cursor: pointer;
`;

type Props = {
	register: boolean;
	type: "username" | "password";
	value: string;
	setValue: (value: string) => void;
};
export default function InputField(props: Props) {
	const [showPassword, setShowPassword] = React.useState(
		props.type != "password"
	);

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const shouldShowResponseText = () => {
		if (!props.register) return false;
		if (props.value.length == 0) return false;
		return true;
	};

	return (
		<div>
			<div css={fieldContainerCss}>
				<input
					css={inputFieldCss}
					type={showPassword ? "text" : "password"}
					placeholder={
						props.type == "username" ? "Username" : "Password"
					}
					value={props.value}
					onChange={(e) => props.setValue(e.target.value)}
				/>
				{props.type == "password" &&
					(showPassword ? (
						<FaEyeSlash
							css={showPasswordCss}
							onClick={handleShowPassword}
						/>
					) : (
						<FaEye
							css={showPasswordCss}
							onClick={handleShowPassword}
						/>
					))}
			</div>
			{shouldShowResponseText() && (
				<ResponseText type={props.type} value={props.value} />
			)}
		</div>
	);
}
