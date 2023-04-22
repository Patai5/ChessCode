from __future__ import annotations

from typing import TypeVar

import chess


class ChessBoard:
    def __init__(self):
        self.board = chess.Board()
        self.color_to_move = chess.WHITE

    @property
    def board(self) -> chess.Board:
        return self._board

    @property
    def moves(self) -> list[chess.Move]:
        return self.board.move_stack

    @board.setter
    def board(self, value: chess.Board):
        assert isinstance(value, chess.Board), "board must be a chess.Board object"

        self._board = value

    def switch_color_to_move(self):
        self.color_to_move = chess.WHITE if self.color_to_move == chess.BLACK else chess.BLACK

    def move(self, move: chess.Move | str) -> ChessBoard.ILLEGAL_MOVE | chess.Outcome | None:
        """
        Moves a piece on the board.

        Parameters:
            - move: The move to make. Can be a chess.Move object or a string in UCI notation.

        Returns:
            - ILLEGAL_MOVE: If the move is illegal.
            - chess.Outcome: If the game is over.
            - None: If the move is legal and the game is not over.
        """
        assert isinstance(move, chess.Move) or isinstance(move, str), "move must be a chess.Move or str object"

        if isinstance(move, str):
            move = chess.Move.from_uci(move)

        if not self.board.is_legal(move):
            return ChessBoard.ILLEGAL_MOVE

        self.board.push(move)
        self.switch_color_to_move()

        outcome = self.board.outcome()
        if outcome:
            return outcome

    ILLEGAL_MOVE = TypeVar("ILLEGAL_MOVE")
    OUT_OF_TIME = TypeVar("OUT_OF_TIME")
