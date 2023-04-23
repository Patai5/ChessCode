/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import ChessBoard, { RefType } from "./ChessBoard/ChessBoard";
import { MoveInfo } from "./ChessBoard/ChessLogic/board";
import { Color, PromotionPieceType } from "./ChessBoard/ChessLogic/pieces";
import { getOppositeColor } from "./ChessBoard/ChessLogic/utils";
import ChessTimer, { TimeMs } from "./ChessTimer/ChessTimer";
import ResultsDisplay, { GameResult } from "./ResultsDisplay/ResultsDisplay";

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
};
function Chess(props: Props, forwardedRef: React.Ref<RefType>) {
    const [colorToPlay, setColorToPlay] = React.useState<Color>(Color.White);
    const oppositeColor = getOppositeColor(props.color);

    // TODO: Disable piece movement when game is over
    return (
        <>
            <ResultsDisplay result={props.gameResult ? props.gameResult : undefined} show={!!props.gameResult} />
            <div css={ChessCss}>
                <ChessTimer
                    time={props.timers[oppositeColor]}
                    paused={oppositeColor !== colorToPlay || !!props.gameResult}
                />
                <ChessBoard
                    color={props.color}
                    broadcastMove={props.broadcastMove}
                    updateColorToPlay={setColorToPlay}
                    ref={forwardedRef}
                />
                <ChessTimer
                    time={props.timers[props.color]}
                    paused={props.color !== colorToPlay || !!props.gameResult}
                />
            </div>
        </>
    );
}

export default React.forwardRef(Chess);
