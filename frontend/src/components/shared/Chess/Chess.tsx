/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import ActionBar, { PlayerProps } from "./ActionBar/ActionBar";
import { ActionsType } from "./ActionBar/QuickActions/QuickActions";
import ChessBoard, { RefType } from "./ChessBoard/ChessBoard";
import { MoveInfo } from "./ChessBoard/ChessLogic/board";
import { Color, PromotionPieceType } from "./ChessBoard/ChessLogic/pieces";
import { getOppositeColor } from "./ChessBoard/ChessLogic/utils";
import ResultsDisplay, { GameResult } from "./ResultsDisplay/ResultsDisplay";

const ChessCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export type PlayersProps = {
    [key in Color]: PlayerProps;
};

type Props = {
    color: Color;
    players: PlayersProps | null;
    gameStarted: boolean;
    gameResult: GameResult | null;
    actions: ActionsType;
    broadcastMove?: (move: MoveInfo, promotionPiece: PromotionPieceType | null) => void;
    isReplay: boolean;
};
function Chess(props: Props, forwardedRef: React.Ref<RefType>) {
    const [colorToPlay, setColorToPlay] = React.useState<Color>(Color.White);
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
                <ChessBoard
                    color={props.color}
                    isEnabled={props.isReplay ? false : !pauseGame}
                    broadcastMove={props.broadcastMove}
                    updateColorToPlay={setColorToPlay}
                    ref={forwardedRef}
                />
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

export default React.forwardRef(Chess);
