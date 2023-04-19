import { Board, Move, MoveInfo } from "./board";
import { PromotionPieceType } from "./pieces";
import { genDefaultBoard } from "./utils";

export default class Chess {
    constructor() {
        this.board = genDefaultBoard();
    }
    board: Board;

    move = (move: Move, promotionPiece: PromotionPieceType | null = null): MoveInfo => {
        return this.board.move(move, promotionPiece);
    };
}
