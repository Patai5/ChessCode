import threading
import time
from typing import Callable, Iterable

import chess
from django.contrib.auth import get_user_model

from .chess_board import CHESS_COLOR_NAMES

User = get_user_model()

TimeS = float
TimeMs = int
APICallbackType = Callable[[str, any], None]


class Player:
    def __init__(
        self,
        user: User,
        color: chess.Color,
        time: TimeS,
        api_callback: APICallbackType = None,
    ):
        self.user = user
        self.color = color
        self.time = time
        self.api_callback = api_callback

        self.timer = None
        self.timer_start = None

    def add_api_callback(self, callback: APICallbackType):
        """Adds a callback function for the player to call the API"""

        self.api_callback = callback

    def get_current_time(self) -> TimeMs:
        """Gets the current time left for the player in milliseconds"""
        if self.timer_start is None:
            currentTime = self.time
        else:
            currentTime = self.time - (time.time() - self.timer_start)

        return int(currentTime * 1000)

    def out_of_time(self, ran_out_of_time: Callable[[str], None]):
        """Called when the player runs out of time"""
        ran_out_of_time(self.user)
        self.time = 0
        self.timer_start = None

    def start_timer(self, ran_out_of_time: Callable[[str], None]):
        """Starts the player's timer"""
        self.timer_start = time.time()

        self.timer = threading.Timer(
            self.time,
            self.out_of_time,
            (ran_out_of_time,),
        )
        self.timer.start()

    def stop_timer(self):
        """Stops the player's timer"""
        if self.timer_start is None:
            return

        self.time -= time.time() - self.timer_start
        self.timer.cancel()
        self.timer_start = None


class Players:
    userPlayers: dict[User, Player]

    def __init__(self, players: list[User]):
        self.userPlayers = {player.user: player for player in players}

    @property
    def players(self) -> Iterable[Player]:
        return self.userPlayers.values()

    @property
    def users(self) -> Iterable[User]:
        return self.userPlayers.keys()

    def by_user(self, user: User):
        """Gets the Player object for the given user"""
        return self.userPlayers.get(user)

    def to_json_dict(self) -> dict[str, dict[str, str]]:
        """Converts the Players object to a JSON serializable dict"""
        return {
            user.username: {"color": CHESS_COLOR_NAMES[player.color], "time": player.get_current_time()}
            for user, player in self.userPlayers.items()
        }
