/** @jsxImportSource @emotion/react */
import FindGame from "./FindGame/FindGame";
import UserMenu from "./UserMenu/UserMenu";

type Props = {};
export default function Home(props: Props) {
    return (
        <>
            <FindGame />
            <UserMenu />
        </>
    );
}
