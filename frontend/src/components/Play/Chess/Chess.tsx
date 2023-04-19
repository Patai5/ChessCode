/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import ChessBoard, { RefType } from "./ChessBoard/ChessBoard";
import { MoveInfo } from "./ChessBoard/ChessLogic/board";
import { getOppositeColor } from "./ChessBoard/ChessLogic/utils";
import { Color, PromotionPieceType } from "./ChessBoard/ChessLogic/pieces";
import ChessTimer, { TimeMs } from "./ChessTimer/ChessTimer";

type Timers = {
    [key in Color]: TimeMs;
};

type Props = {
    color: Color;
    timers: Timers;
    broadcastMove: (move: MoveInfo, promotionPiece: PromotionPieceType | null) => void;
};
function Chess(props: Props, forwardedRef: React.Ref<RefType>) {
    return (
        <>
            <ChessTimer time={props.timers[getOppositeColor(props.color)]} />
            <ChessTimer time={props.timers[props.color]} />
            <ChessBoard color={props.color} broadcastMove={props.broadcastMove} ref={forwardedRef} />
        </>
    );
}

export default React.forwardRef(Chess);
