/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import ActionBar, { PlayerProps } from "./ActionBar/ActionBar";
import { Actions } from "./ActionBar/QuickActions/QuickActions";
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
    players: PlayersProps;
    gameStarted: boolean;
    gameResult: GameResult | null;
    broadcastMove: (move: MoveInfo, promotionPiece: PromotionPieceType | null) => void;
    actions: Actions;
};
function Chess(props: Props, forwardedRef: React.Ref<RefType>) {
    const [colorToPlay, setColorToPlay] = React.useState<Color>(Color.White);
    const pauseGame = !props.gameStarted || !!props.gameResult;

    return (
        <>
            <ResultsDisplay result={props.gameResult ? props.gameResult : undefined} show={!!props.gameResult} />
            <div css={ChessCss}>
                <ActionBar
                    player={props.players[getOppositeColor(props.color)]}
                    timerPaused={props.color === colorToPlay || pauseGame}
                />
                <ChessBoard
                    color={props.color}
                    isEnabled={!pauseGame}
                    broadcastMove={props.broadcastMove}
                    updateColorToPlay={setColorToPlay}
                    ref={forwardedRef}
                />
                <ActionBar
                    player={props.players[props.color]}
                    actions={props.actions}
                    timerPaused={props.color !== colorToPlay || pauseGame}
                />
            </div>
        </>
    );
}

export default React.forwardRef(Chess);
