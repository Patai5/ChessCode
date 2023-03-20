from typing import Any, Callable, Dict, Tuple

import chess
from django.contrib.auth import get_user_model

from ..utils import genUniqueID
from .chess_board import ChessBoard
from .game_modes import GameMode, TimeControl

User = get_user_model()


class Game:
    # TODO: Implement player colors (white/black)
    def __init__(
        self, players: Tuple[User, User], game_mode: GameMode, time_control: TimeControl, game_id: str | None = None
    ):
        self.players = players
        self.game_mode = game_mode
        self.time_control = time_control
        self.game_id = game_id
        self.board = ChessBoard()

    @property
    def players(self) -> Tuple[User, User]:
        return self._players

    @players.setter
    def players(self, value: Tuple[User, User]):
        assert isinstance(value, tuple), "Players must be a tuple"
        assert len(value) == 2, "Players must be a tuple of exactly two players"
        assert all(isinstance(item, User) for item in value), "Players must be a tuple of Users"

        self._players = value

    @property
    def game_mode(self) -> GameMode:
        return self._game_mode

    @game_mode.setter
    def game_mode(self, value: GameMode):
        assert isinstance(value, GameMode), "Game mode must be a GameMode object"

        self._game_mode = value

    @property
    def time_control(self) -> TimeControl:
        return self._time_control

    @time_control.setter
    def time_control(self, value: TimeControl):
        assert isinstance(value, TimeControl), "Time control must be a TimeControl object"

        self._time_control = value

    @property
    def game_id(self) -> str | None:
        return self._game_id

    @game_id.setter
    def game_id(self, value: str | None):
        assert value is None or isinstance(value, str), "Game ID must be a string"
        assert value is None or len(value) == 8, "Game ID must be 8 characters long"

        self._game_id = value

    @property
    def board(self) -> ChessBoard:
        return self._board

    @board.setter
    def board(self, value: ChessBoard):
        assert isinstance(value, ChessBoard), "Board must be a ChessBoard object"

        self._board = value

    @property
    def api_callbacks(self) -> dict[User, Callable[[str, str], None]]:
        """A dicture of callback functions to be when the game state changes.

        Notifies the users of the game's state change using websockets"""
        return self._api_callbacks

    @api_callbacks.setter
    def api_callbacks(self, value: dict[User, Callable[[str, Any], None]]):
        assert isinstance(value, dict), "API callbacks must be a dictionary"
        assert all(isinstance(item, User) for item in value.keys()), "API callbacks must be a dictionary of users"
        assert all(
            callable(item) for item in value.values()
        ), "API callbacks must be a dictionary of callback functions"

        self._api_callbacks = value

    def add_api_callback(self, player: User, callback: Callable[[str, Any], None]):
        """Adds a callback function to the game's API callbacks."""
        assert isinstance(player, User), "Player must be a User object"
        assert callable(callback), "Callback must be a callable function"

        self.api_callbacks[player] = callback

    def callback_game_result(self, result: chess.Outcome):
        """Calls the API callbacks with the game result."""
        assert isinstance(result, chess.Outcome), "Result must be a chess.Outcome object"

        for callback in self.api_callbacks.values():
            callback("game_result", result)

    def callback_move(self, user: User, move: chess.Move | str):
        """Calls the API callbacks with the move."""
        assert isinstance(user, User), "User must be a User object"
        assert isinstance(move, chess.Move) or isinstance(move, str), "move must be a chess.Move or str object"

        if isinstance(move, chess.Move):
            move = move.uci()

        for userKey, callback in self.api_callbacks.items():
            if userKey != user:
                callback("move", move)

    def move(self, user: User, move: chess.Move | str) -> ChessBoard.ILLEGAL_MOVE | chess.Outcome | None:
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

        result = self.board.move(move)

        self.callback_move(user, move)
        if isinstance(result, chess.Outcome):
            self.callback_game_result(result)
        return result


class GameManager:
    def __init__(self):
        self.games = {}

    @property
    def games(self) -> Dict[str, Game]:
        return self._games

    @games.setter
    def games(self, value: Dict[str, Game]):
        self._games = value

    def get_game(self, game_id: str) -> Game | None:
        assert isinstance(game_id, str), "Game ID must be a string"
        assert len(game_id) == 8, "Game ID must be 8 characters long"

        return self.games.get(game_id)

    def start_game(self, players: Tuple[User, User], game_mode: GameMode, time_control: TimeControl) -> Game:
        assert isinstance(players, tuple), "Players must be a tuple"
        assert len(players) == 2, "Players must be a tuple of exactly two players"
        assert all(isinstance(item, User) for item in players), "Players must be a tuple of Users"
        assert isinstance(game_mode, GameMode), "Game mode must be a GameMode object"
        assert isinstance(time_control, TimeControl), "Time control must be a TimeControl object"

        game_id = genUniqueID(self.games)
        game = Game(players, game_mode, time_control, game_id=game_id)
        self.games[game_id] = game
        return game


ALL_ACTIVE_GAMES_MANAGER = GameManager()
"""Manages all currently active games in the system"""
