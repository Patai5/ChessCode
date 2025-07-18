/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Chess from "components/shared/Chess/Chess";
import { Color } from "components/shared/Chess/ChessBoard/ChessLogic/pieces";
import { useChessBoardState } from "components/shared/Chess/useChessBoardState/useChessBoardState";
import Loading from "components/shared/Loading";
import UserMenu from "components/shared/UserMenu/UserMenu";
import { AppContext } from "hooks/appContext";
import React from "react";
import { useParams } from "react-router-dom";
import { CONNECTION_STATE, usePlayApi } from "./usePlayApi";

const playCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export default function Play() {
    const appContext = React.useContext(AppContext);
    const { username: clientUsername } = appContext;

    const [color, setColor] = React.useState<Color>(Color.White);
    const [gameStarted, setGameStarted] = React.useState(true);

    const chessBoardStateHandlers = useChessBoardState({ color, isEnabled: gameStarted });
    const { handleClientMakeMove } = chessBoardStateHandlers;

    const { id: gameId } = useParams();

    const playGameApi = usePlayApi({ gameId, clientUsername, setColor, setGameStarted, handleClientMakeMove });
    const { connectionState, players, highlightDrawButton, gameResult, broadcastMove, handleResign, handleOfferDraw } =
        playGameApi;

    const chessProps = {
        color: color,
        players: players,
        gameStarted: gameStarted,
        gameResult: gameResult,
        broadcastMove: broadcastMove,
        actions: {
            playActions: {
                highlightDraw: highlightDrawButton,
                resign: handleResign,
                offerDraw: handleOfferDraw,
            },
        },
        isReplay: false,
        chessBoardStateHandlers,
    };

    return (
        <>
            <UserMenu />

            <div css={playCss}>
                {connectionState === CONNECTION_STATE.CONNECTING && <Loading displayText="Connecting" />}
                {connectionState === CONNECTION_STATE.CONNECTED && <Chess {...chessProps} />}
            </div>
        </>
    );
}
