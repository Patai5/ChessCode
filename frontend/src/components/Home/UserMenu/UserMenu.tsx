/** @jsxImportSource @emotion/react */
import React from "react";
import LoggedInMenu from "./LoggedInMenu/LoggedInMenu";
import LoginButton from "./LoginButton/LoginButton";

type Props = {};
export default function UserMenu(props: Props) {
    const [clientUsername, setClientUsername] = React.useState<null | string>(null);

    React.useEffect(() => {
        setClientUsername(localStorage.getItem("username"));
    }, []);

    return <>{clientUsername === null ? <LoginButton /> : <LoggedInMenu username={clientUsername} />}</>;
}
