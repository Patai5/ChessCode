/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import ProfilePicture from "components/shared/ProfilePicture";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DisplayCss = css`
    display: flex;
    flex-direction: row;
    gap: 0.75em;
    justify-content: center;
    align-items: center;
    padding: 0.5em 0.8em;

    color: white;
    cursor: pointer;
    user-select: none;

    transition: box-shadow 0.2s ease-in-out;

    :hover {
        box-shadow: inset 0 0 0.5em 0.5em rgba(0, 0, 0, 0.1);
    }
`;
const UsernameCss = css`
    margin: 0;
    align-self: center;
    font-family: "Lexend Deca", sans-serif;
    font-weight: 600;
`;
const SignInCss = css`
    padding: 0.75em 1.2em;
`;
const SignInIconCss = css`
    font-size: 1.2em;
    margin: 0 0.2em 0 0;
`;

type Props = { username: string | null };
export default function Display(props: Props) {
    const navigate = useNavigate();
    const isUserSignedIn = props.username !== null;

    const handleOnClick = () => {
        if (!isUserSignedIn) {
            navigate("/login");
        }
    };

    return (
        <div css={[DisplayCss, !isUserSignedIn && SignInCss]} onClick={handleOnClick}>
            {isUserSignedIn ? <ProfilePicture username={props.username!} /> : <FaSignInAlt css={SignInIconCss} />}
            <p css={UsernameCss}>{props.username || "Sign in"}</p>
        </div>
    );
}
