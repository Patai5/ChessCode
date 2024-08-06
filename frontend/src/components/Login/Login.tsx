/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios, { AxiosError } from "axios";
import { ErrorQueueClass } from "components/shared/ErrorQueue/ErrorQueue";
import { AppContext } from "hooks/appContext";
import React from "react";
import { useNavigate } from "react-router-dom";
import getCSRF from "../../utils/getCSRF";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import InputFields from "./InputFields/InputFields";
import LoginButton from "./LoginButton/LoginButton";
import SwitchSigninSignup from "./SwitchSigninSignup/SwitchSigninSignup";

const loginBoxCss = css`
    background: linear-gradient(
            rgb(255, 0, 255, 0.2) 50%,
            rgb(255, 0, 255, 0.25) 58%,
            rgb(255, 0, 255, 0.15) 66%,
            rgba(0, 0, 0, 0)
        ),
        #291c39;
    background-size: 100% 300%;
    background-position: 0 100%;
    transition: background 1.5s ease-out;
    border-radius: 1em;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 4.5em;
    width: 25em;
    height: 36em;
    font-size: 0.7em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0.1em 0.5em 0.25em rgb(0 0 0 / 25%);
`;
const loginAnimationCss = css`
    background-position: 0 0;
`;
const errorMessageCss = css``;
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
    const [errorMessage, setErrorMessage] = React.useState("");
    const appContext = React.useContext(AppContext);
    const navigate = useNavigate();

    // Removes the error message when the user switches between login and register
    React.useMemo(() => setErrorMessage(""), [props.register]);
    /** Checks if the username already registered */
    const userExists = async (): Promise<boolean | AxiosError> => {
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

    /** Checks whether the inputs in the form are valid
     * @returns {true | string} Returns true if the form is valid, otherwise returns an string message on why the form is invalid */
    const validateForm = (): true | string => {
        const { username, password } = loginForm;
        if (!username) return "Username cannot be empty";
        if (!password) return "Password cannot be empty";

        // Continue only if the user is registering
        if (!props.register) return true;
        if (username.length < 3) return "Username must be at least 3 characters long";
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (username.length > 15) return "Username must be at most 15 characters long";
        if (password.length > 255) return "Password must be at most 255 characters long";
        if (!username.match(/^[a-zA-Z0-9._-]*$/))
            return "Username can only contain letters, numbers, underscores, dashes and periods";
        if (!password.match(/^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).*/))
            return "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character";
        return true;
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

        let error: string | Error = "";
        let requestStatus: RequestStatus = "started";
        let animationFinished = false;

        /** Should be called in requests to the server dealing with the animation */
        const handleAuthRequestAnimation = (status: RequestStatus) => {
            // Sets the requestStatus to the right status so that the animation can be handled once it is finished
            requestStatus = status;
            // If the animation is already finished then handle the animation here
            if (animationFinished) handleAnimation(status);
        };

        // Sets the logging in animation
        setTimeout(() => {
            handleAnimation(requestStatus);
            animationFinished = true;
        }, 1500);
        setLoggingInAnimation(true);

        // Checks if the form is valid
        const isValidForm = validateForm();
        if (isValidForm !== true) {
            handleAuthRequestAnimation("failed");
            error = isValidForm;
        }

        // When registering check if the username already exists
        let usernameExists: boolean | Error = false;
        if (!error && props.register) {
            usernameExists = await userExists();
            if (usernameExists instanceof Error) {
                error = usernameExists;
                handleAuthRequestAnimation("failed");
            } else if (usernameExists) {
                error = "This username is already taken";
                handleAuthRequestAnimation("failed");
            }
        }
        // Auths the user
        if (!error) {
            const authed = await authUser(props.register);
            if (authed instanceof Error) {
                handleAuthRequestAnimation("failed");
                if (authed instanceof AxiosError && authed.response && authed.response.status === 401) {
                    // Incorect credentials inputed
                    error = "Incorrect username or password";
                } else {
                    error = authed;
                }
            } else {
                // Successfully authed
                appContext.setUsername(loginForm.username);
                handleAuthRequestAnimation("success");
            }
        }

        setErrorMessage(ErrorQueueClass.getErrorMessage(error));
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
            <div css={[loginBoxCss, loggingInAnimation && loginAnimationCss, errorMessage && errorMessageCss]}>
                {errorMessage ? (
                    <ErrorMessage message={errorMessage} setErrorMessage={setErrorMessage} />
                ) : (
                    <h1 css={headerCss}>{props.register ? "Sign up" : "Sign in"}</h1>
                )}

                <InputFields register={props.register} fields={loginForm} handleSetField={handleSetField} />

                <SwitchSigninSignup register={props.register} />
                <LoginButton register={props.register} />
            </div>
        </form>
    );
}
