/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { GameResultApiResponse } from "types/api/gameResult";
import ActionBar, { PlayerProps } from "./ActionBar/ActionBar";
import { ActionsType } from "./ActionBar/QuickActions/QuickActions";
import ChessBoard from "./ChessBoard/ChessBoard";
import { Color } from "./ChessBoard/ChessLogic/pieces";
import { getOppositeColor } from "./ChessBoard/ChessLogic/utils";
import ResultsDisplay from "./ResultsDisplay/ResultsDisplay";
import { ChessBoardStateHandlersProps } from "./useChessBoardState/useChessBoardState";

const ChessCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export type PlayersProps = {
    [key in Color]: PlayerProps;
};

export type ChessProps = {
    color: Color;
    players: PlayersProps | null;
    gameStarted: boolean;
    gameResult: GameResultApiResponse | null;
    actions: ActionsType;
    isReplay: boolean;
    chessBoardStateHandlers: ChessBoardStateHandlersProps;
};

export default function Chess(props: ChessProps) {
    const { colorToPlay } = props.chessBoardStateHandlers;
    const pauseGame = !props.gameStarted || !!props.gameResult;

    return (
        <>
            <ResultsDisplay result={props.gameResult ? props.gameResult : undefined} show={!!props.gameResult} />
            <div css={ChessCss}>
                {props.players && (
                    <ActionBar
                        player={props.players[getOppositeColor(props.color)]}
                        isReplay={props.isReplay}
                        timerPaused={props.color === colorToPlay || pauseGame}
                    />
                )}
                <ChessBoard color={props.color} chessBoardStateHandlers={props.chessBoardStateHandlers} />
                {props.players && (
                    <ActionBar
                        player={props.players[props.color]}
                        actions={props.actions}
                        isReplay={props.isReplay}
                        timerPaused={props.color !== colorToPlay || pauseGame}
                    />
                )}
            </div>
        </>
    );
}
