import { Board, Move, MoveInfo } from "./board";
import { PromotionPieceType } from "./pieces";
import { genDefaultBoard, positionGenerator } from "./utils";

export default class Chess {
    constructor() {
        this.board = genDefaultBoard();
    }
    board: Board;

    move = (move: Move, promotionPiece: PromotionPieceType | null = null): MoveInfo => {
        return this.board.move(move, promotionPiece);
    };

    undoMove = (): MoveInfo | null => {
        this.board.undoMove()!;

        const lastMove = this.board.moves[this.board.moves.length - 1];
        return lastMove || null;
    };

    positionGenerator = () => positionGenerator(this.board);
}
