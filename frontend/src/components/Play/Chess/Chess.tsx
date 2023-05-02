/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import ChessBoard, { RefType } from "./ChessBoard/ChessBoard";
import { MoveInfo } from "./ChessBoard/ChessLogic/board";
import { Color, PromotionPieceType } from "./ChessBoard/ChessLogic/pieces";
import { getOppositeColor } from "./ChessBoard/ChessLogic/utils";
import { TimeMs } from "./ActionBar/ChessTimer/ChessTimer";
import { Actions } from "./ActionBar/QuickActions/QuickActions";
import ResultsDisplay, { GameResult } from "./ResultsDisplay/ResultsDisplay";
import ActionBar from "./ActionBar/ActionBar";

const ChessCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export type Timers = {
    [key in Color]: TimeMs;
};

type Props = {
    color: Color;
    timers: Timers;
    gameResult: GameResult | null;
    broadcastMove: (move: MoveInfo, promotionPiece: PromotionPieceType | null) => void;
    actions: Actions;
};
function Chess(props: Props, forwardedRef: React.Ref<RefType>) {
    const [colorToPlay, setColorToPlay] = React.useState<Color>(Color.White);
    const oppositeColor = getOppositeColor(props.color);

    return (
        <>
            <ResultsDisplay result={props.gameResult ? props.gameResult : undefined} show={!!props.gameResult} />
            <div css={ChessCss}>
                <ActionBar
                    time={props.timers[oppositeColor]}
                    timerPaused={oppositeColor !== colorToPlay || !!props.gameResult}
                />
                <ChessBoard
                    color={props.color}
                    isEnabled={!props.gameResult}
                    broadcastMove={props.broadcastMove}
                    updateColorToPlay={setColorToPlay}
                    ref={forwardedRef}
                />
                <ActionBar
                    time={props.timers[props.color]}
                    timerPaused={props.color !== colorToPlay || !!props.gameResult}
                    actions={props.actions}
                />
            </div>
        </>
    );
}

export default React.forwardRef(Chess);
