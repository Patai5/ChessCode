import random
from typing import Dict, Iterable

import chess
from django.contrib.auth import get_user_model

from ..utils import genUniqueID
from .chess_board import ChessBoard
from .game_modes import GameMode, TimeControl
from .players import Player, Players

User = get_user_model()


class Game:
    def __init__(self, players: Players, game_mode: GameMode, time_control: TimeControl, game_id: str | None = None):
        self.players = players
        self.game_mode = game_mode
        self.time_control = time_control
        self.game_id = game_id
        self.board = ChessBoard()

        self.update_player_timers()

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

    # TODO: Player's api_callback might not be initialized yet if the user hasn't joined the game yet
    def callback_game_result(self, result: chess.Outcome):
        """Calls the API callbacks with the game result."""
        assert isinstance(result, chess.Outcome), "Result must be a chess.Outcome object"

        for player in self.players.players:
            player.api_callback("game_result", result)

    def callback_out_of_time(self, user: User):
        """Calls the API callbacks with the player that ran out of time."""
        assert isinstance(user, User), "User must be a User object"

        for player in self.players.players:
            player.api_callback("out_of_time", user.username)

    def callback_move(self, user: User, move: chess.Move | str):
        """Calls the API callbacks with the move."""
        assert isinstance(user, User), "User must be a User object"
        assert isinstance(move, chess.Move) or isinstance(move, str), "move must be a chess.Move or str object"

        if isinstance(move, chess.Move):
            move = move.uci()

        for player in self.players.players:
            if player.user != user:
                player.api_callback("move", move)

    def get_moves_list(self) -> list[str]:
        """Returns a list of all moves made in the game in UCI notation."""
        return [move.uci() for move in self.board.moves]

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
        if result is ChessBoard.ILLEGAL_MOVE:
            return ChessBoard.ILLEGAL_MOVE

        self.update_player_timers()
        self.callback_move(user, move)
        if isinstance(result, chess.Outcome):
            self.callback_game_result(result)
        return result

    def ran_out_of_time(self, user: User):
        """Handles the case when a player runs out of time."""
        assert isinstance(user, User), "User must be a User object"

        self.callback_out_of_time(user)

    def update_player_timers(self):
        """Updates the player timers."""
        for player in self.players.players:
            if player.color == self.board.color_to_move:
                player.start_timer(self.ran_out_of_time)
            else:
                player.stop_timer()

    def is_players_turn(self, user: User) -> bool:
        """Checks if it is the user's turn."""
        assert isinstance(user, User), "User must be a User object"

        return self.board.color_to_move == self.players.by_user(user).color


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

    def start_game(self, players: Iterable[User], game_mode: GameMode, time_control: TimeControl) -> Game:
        assert isinstance(players, Iterable), "Players must be a iterable"
        assert len(players) == 2, "Players must be a tuple of exactly two players"
        assert all(isinstance(item, User) for item in players), "Players must be a iterable of Users"
        assert isinstance(game_mode, GameMode), "Game mode must be a GameMode object"
        assert isinstance(time_control, TimeControl), "Time control must be a TimeControl object"

        game_id = genUniqueID(self.games)

        colors = [chess.WHITE, chess.BLACK]
        random.shuffle(colors)

        players = Players([Player(user, color, time_control.time) for user, color in zip(players, colors)])

        game = Game(players, game_mode, time_control, game_id=game_id)
        self.games[game_id] = game
        return game


ALL_ACTIVE_GAMES_MANAGER = GameManager()
"""Manages all currently active games in the system"""
