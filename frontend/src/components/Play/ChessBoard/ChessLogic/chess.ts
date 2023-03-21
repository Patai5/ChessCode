import { Board } from "./board";
import { genDefaultBoard } from "./utils";

export default class Chess {
    constructor() {
        this.board = genDefaultBoard();
    }
    board: Board;
}
