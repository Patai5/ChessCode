from typing import Tuple, List
from django.contrib.auth import get_user_model
from .game_modes import GameMode, TimeControl

User = get_user_model()


class Game:
    def __init__(self, players: Tuple[User, User], game_mode: GameMode, time_control: TimeControl):
        self.players = players
        self.game_mode = game_mode
        self.time_control = time_control

    @property
    def players(self) -> Tuple[User, User]:
        return self.players

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


class GameManager:
    def __init__(self):
        self.games = []

    @property
    def games(self) -> List[Game]:
        return self._games

    @games.setter
    def games(self, value: List[Game]):
        self._games = value

    def start_game(self, players: Tuple[User, User], game_mode: GameMode, time_control: TimeControl) -> Game:
        assert isinstance(players, tuple), "Players must be a tuple"
        assert len(players) == 2, "Players must be a tuple of exactly two players"
        assert all(isinstance(item, User) for item in players), "Players must be a tuple of Users"
        assert isinstance(game_mode, GameMode), "Game mode must be a GameMode object"
        assert isinstance(time_control, TimeControl), "Time control must be a TimeControl object"

        print("A GAME IS STARTED HERE")
        game = Game(players, game_mode, time_control)
        self.games.append(game)
        return game


ALL_ACTIVE_GAMES_MANAGER = GameManager()
"""Manages all currently active games in the system"""
