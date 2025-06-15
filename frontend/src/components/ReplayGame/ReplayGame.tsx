/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Chess from "components/shared/Chess/Chess";
import Loading from "components/shared/Loading";
import UserMenu from "components/shared/UserMenu/UserMenu";
import { useReplayGame } from "./hooks/useReplayGame";

const replayCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

/**
 * Displays a replay of a finished game. Allows the user to move back and forth through the game.
 */
export const ReplayGame = () => {
    const { replayGameState, actions, chessBoardStateHandlers } = useReplayGame();

    const chessProps = replayGameState && {
        ...replayGameState,
        chessBoardStateHandlers,
        isReplay: true,
        gameStarted: true,
        actions: { replayActions: actions },
    };

    return (
        <>
            <UserMenu />

            <div css={replayCss}>
                {!chessProps && <Loading />}
                {chessProps && <Chess {...chessProps} />}
            </div>
        </>
    );
};
