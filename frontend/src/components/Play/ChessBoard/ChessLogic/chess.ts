import { Board, Move, MoveInfo } from "./board";
import { genDefaultBoard } from "./utils";

export default class Chess {
    constructor() {
        this.board = genDefaultBoard();
    }
    board: Board;

    move = (move: Move): MoveInfo => {
        return this.board.move(move);
    };
}
