/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import getCSRF from "../../utils/getCSRF";
import React from "react";
import axios from "axios";
import InputFields from "./InputFields/InputFields";
import SwitchSigninSignup from "./SwitchSigninSignup/SwitchSigninSignup";
import LoginButton from "./LoginButton/LoginButton";
import { useNavigate } from "react-router-dom";

const loginBoxCss = css`
	background: linear-gradient(rgb(255, 0, 255, 0.2) 50%, rgb(255, 0, 255, 0.25) 58% ,rgb(255, 0, 255, 0.15) 66%, rgba(0, 0, 0, 0)), #291C39;);
	background-size: 100% 300%;
	background-position: 0 100%;
	transition: background 1.5s ease-out;
	border-radius: 1em;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	padding: 4.5em;
	width: 25em;
	height: 36em;
	font-size: 0.7em;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0 0.1em 0.5em rgb(0 0 0 / 25%);
`;
const loginAnimationCss = css`
	background-position: 0 0;
`;
const headerCss = css`
	color: white;
	padding: 0.875em 0;
	font-size: 3em;
	margin: 0;
	font-family: "Lexend Deca", sans-serif;
	font-weight: 500;
`;

type Props = { register: boolean };
export type LoginFormType = { username: string; password: string };
export default function Login(props: Props) {
	const [loginForm, setLoginForm] = React.useState<LoginFormType>({
		username: "",
		password: "",
	});
	const [loggingInAnimation, setLoggingInAnimation] = React.useState(false);
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Sets the logging in animation
		let status = "started";
		let animationFinished = false;
		setTimeout(() => {
			// Handles the animation logic
			switch (status) {
				case "success":
					// Redirect the page
					navigate("/");
					return;
				case "failed":
					// Stops the animation
					setLoggingInAnimation(false);
					return;
				case "started":
					// Request wasn't finished in time, the logic will be handled in the request
					animationFinished = true;
					return;
			}
		}, 1500);
		setLoggingInAnimation(true);

		const url = props.register ? "/api/auth/register" : "/api/auth/login";
		axios({
			method: "post",
			url: url,
			data: {
				password: loginForm.password,
				username: loginForm.username,
			},
			headers: { "X-CSRFToken": getCSRF() },
		})
			.then((res) => {
				// Sets the status to success so that after the animation finishes a redirect can be made
				status = "success";
				// If the animation is allready finished then redirect the page
				animationFinished && navigate("/");
			})
			.catch((err) => {
				// Sets the status to failed so that the animation can be stopped
				status = "failed";
			});
	};

	const handleSetField = (type: "username" | "password", value: string) => {
		if (type == "username") {
			setLoginForm({ ...loginForm, username: value });
		} else {
			setLoginForm({ ...loginForm, password: value });
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<div css={[loginBoxCss, loggingInAnimation && loginAnimationCss]}>
				<h1 css={headerCss}>
					{props.register ? "Sign up" : "Sign in"}
				</h1>
				<InputFields
					fields={loginForm}
					handleSetField={handleSetField}
				/>
				<SwitchSigninSignup register={props.register} />
				<LoginButton register={props.register} />
			</div>
		</form>
	);
}
