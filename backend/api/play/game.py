from typing import Dict, Tuple

from django.contrib.auth import get_user_model

from ..utils import genUniqueID
from .game_modes import GameMode, TimeControl

User = get_user_model()


class Game:
    def __init__(
        self, players: Tuple[User, User], game_mode: GameMode, time_control: TimeControl, game_id: str | None = None
    ):
        self.players = players
        self.game_mode = game_mode
        self.time_control = time_control
        self.game_id = game_id

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
