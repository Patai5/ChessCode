/** @jsxImportSource @emotion/react */
import UserMenu from "components/shared/UserMenu/UserMenu";
import FindGame from "./FindGame/FindGame";

type Props = {};
export default function Home(props: Props) {
    return (
        <>
            <UserMenu />
            <FindGame />
        </>
    );
}
