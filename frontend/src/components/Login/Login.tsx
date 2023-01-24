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

	/** Checks if the username already registered */
	const userExists = async (): Promise<boolean | Error> => {
		try {
			const res = await axios({
				method: "get",
				url: "/api/accounts/user-exists",
				params: { username: loginForm.username },
			});
			return res.data["user-exists"];
		} catch (err) {
			return err;
		}
	};

	/** Authenticates the user */
	const authUser = async (register: boolean): Promise<"success" | Error> => {
		const url = register ? "/api/auth/register" : "/api/auth/login";
		try {
			await axios({
				method: "post",
				url: url,
				data: {
					password: loginForm.password,
					username: loginForm.username,
				},
				headers: { "X-CSRFToken": getCSRF() },
			});
			return "success";
		} catch (err) {
			return err;
		}
	};

	type RequestStatus = "started" | "success" | "failed";
	/** Handles what should happen after which animation state*/
	const handleAnimation = (status: RequestStatus) => {
		switch (status) {
			case "success":
				// Redirects the page
				navigate("/");
				break;
			case "failed":
				// Stops the animation
				setLoggingInAnimation(false);
				break;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Todo: Validate form before sending

		let requestStatus: RequestStatus = "started";
		let animationFinished = false;

		/** Should be called in requests to the server dealing with the animation */
		const handleAuthRequestAnimation = (status: RequestStatus) => {
			// Sets the requestStatus to the right status so that the animation can be handled once it is finished
			requestStatus = status;
			// If the animation is already finished then handle the animation here
			animationFinished && handleAnimation(status);
		};

		// Sets the logging in animation
		setTimeout(() => {
			handleAnimation(requestStatus);
			animationFinished = true;
		}, 1500);
		setLoggingInAnimation(true);

		// When registering check if the username already exists
		let usernameExists: boolean | Error = false;
		if (props.register) {
			usernameExists = await userExists();
			if (usernameExists instanceof Error) {
				// Todo: Handle error
				handleAuthRequestAnimation("failed");
			}
			if (usernameExists) {
				// Todo: Handle username already exists
				handleAuthRequestAnimation("failed");
			}
		}

		// Auths the user
		if (!usernameExists) {
			const authed = await authUser(props.register);
			if (authed instanceof Error) {
				// Todo: Handle error
				handleAuthRequestAnimation("failed");
			} else {
				handleAuthRequestAnimation("success");
			}
		}
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
					register={props.register}
					fields={loginForm}
					handleSetField={handleSetField}
				/>
				<SwitchSigninSignup register={props.register} />
				<LoginButton register={props.register} />
			</div>
		</form>
	);
}
