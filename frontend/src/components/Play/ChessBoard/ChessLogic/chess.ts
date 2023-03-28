import { Board, Move } from "./board";
import { genDefaultBoard } from "./utils";

export default class Chess {
    constructor() {
        this.board = genDefaultBoard();
    }
    board: Board;

    move = (move: Move) => {
        this.board.move(move);
    };
}
