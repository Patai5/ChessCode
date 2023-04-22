/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import ChessBoard, { RefType } from "./ChessBoard/ChessBoard";
import { MoveInfo } from "./ChessBoard/ChessLogic/board";
import { getOppositeColor } from "./ChessBoard/ChessLogic/utils";
import { Color, PromotionPieceType } from "./ChessBoard/ChessLogic/pieces";
import ChessTimer, { TimeMs } from "./ChessTimer/ChessTimer";

const ChessCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const YourTimerCss = css``;
const OpponentTimerCss = css``;

export type Timers = {
    [key in Color]: TimeMs;
};

type Props = {
    color: Color;
    timers: Timers;
    broadcastMove: (move: MoveInfo, promotionPiece: PromotionPieceType | null) => void;
};
function Chess(props: Props, forwardedRef: React.Ref<RefType>) {
    const [colorToPlay, setColorToPlay] = React.useState<Color>(Color.White);
    const oppositeColor = getOppositeColor(props.color);

    return (
        <div css={ChessCss}>
            <ChessTimer
                time={props.timers[oppositeColor]}
                paused={oppositeColor !== colorToPlay}
                css={OpponentTimerCss}
            />
            <ChessBoard
                color={props.color}
                broadcastMove={props.broadcastMove}
                updateColorToPlay={setColorToPlay}
                ref={forwardedRef}
            />
            <ChessTimer time={props.timers[props.color]} paused={props.color !== colorToPlay} css={YourTimerCss} />
        </div>
    );
}

export default React.forwardRef(Chess);
