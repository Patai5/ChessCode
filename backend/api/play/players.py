import threading
import time
from typing import Any, Callable, Iterable

import chess
from django.contrib.auth.models import AnonymousUser
from users.models import User

from ..friends.friends import getFriendStatus
from .chess_board import CHESS_COLOR_NAMES, get_opposite_color

TimeS = float
TimeMs = int
APICallbackType = Callable[[str, Any], None]


class Player:
    def __init__(
        self,
        user: User | AnonymousUser,
        color: chess.Color,
        time: TimeS,
    ):
        self.user: User | AnonymousUser = user
        self.color = color
        self.time = time

        self.joined = False
        self.offers_draw = False
        self.timer: threading.Timer | None = None
        self.timer_start: float | None = None

    def api_callback(self, type: str, changed: Any | None = None) -> None:
        """Calls the API callback"""
        if self.joined:
            self._api_callback(type, changed)

    def join_game(self, callback: APICallbackType) -> None:
        """Joins the player to the game and adds an API callback"""
        self.joined = True
        self._api_callback = callback

    def get_current_time(self) -> TimeMs:
        """Gets the current time left for the player in milliseconds"""
        if self.timer_start is None:
            currentTime = self.time
        else:
            currentTime = self.time - (time.time() - self.timer_start)

        return int(currentTime * 1000)

    def out_of_time(self, ran_out_of_time: Callable[[chess.Color], None]) -> None:
        """Called when the player runs out of time"""
        ran_out_of_time(self.color)
        self.time = 0
        self.timer_start = None

    def start_timer(self, ran_out_of_time: Callable[[], None]) -> None:
        """Starts the player's timer"""
        self.timer_start = time.time()

        self.timer = threading.Timer(
            self.time,
            self.out_of_time,
            (ran_out_of_time,),
        )
        self.timer.start()

    def stop_timer(self) -> None:
        """Stops the player's timer"""
        if self.timer_start is None or self.timer is None:
            return

        self.time -= time.time() - self.timer_start
        self.timer.cancel()
        self.timer_start = None


class Players:
    userPlayers: dict[User | AnonymousUser, Player]

    def __init__(self, players: list[Player]):
        self.userPlayers = {player.user: player for player in players}

    @property
    def players(self) -> Iterable[Player]:
        return self.userPlayers.values()

    @property
    def users(self) -> Iterable[User | AnonymousUser]:
        return self.userPlayers.keys()

    @property
    def is_draw_agreement(self) -> bool:
        return all(player.offers_draw for player in self.players)

    def remove_draw_offers(self) -> None:
        """Removes all draw offers from the players"""
        for player in self.players:
            player.offers_draw = False

    def join_game(self, user: User, callback: APICallbackType) -> None:
        """Joins the given user to the game. Replaces the UnknownPlayer if it exists"""
        if user not in self.userPlayers and AnonymousUser() in self.userPlayers:
            self.userPlayers[user] = self.userPlayers.pop(AnonymousUser())

        self.by_user(user).join_game(callback)

    def get_opponent(self, user: User) -> Player:
        """Gets the Player object for the opponent of the given user"""
        return self.by_color(get_opposite_color(self.by_user(user).color))

    def by_color(self, color: chess.Color) -> Player:
        """Gets the Player object for the given color"""
        players = list(self.players)

        playerIndex = 0 if color == players[0].color else 1
        return players[playerIndex]

    def by_user(self, user: User) -> Player:
        """Gets the Player object for the given user"""
        return self.userPlayers[user]

    def to_json_dict(self, friend: User | None = None) -> dict[str, dict[str, Any]]:
        """Converts the Players object to a JSON serializable dict
        - If `friend` parameter is not None, the friend status of the users will be added to the opponent"""
        friendStatus = {}
        if friend is not None and friend in self.userPlayers:
            opponent = self.get_opponent(friend).user
            if isinstance(opponent, User):
                friendStatus = {"opponent": getFriendStatus(friend, opponent).value}

        return {
            CHESS_COLOR_NAMES[player.color]: {
                "username": user.username if isinstance(user, User) else None,
                "time": player.get_current_time(),
                **(friendStatus),
            }
            for user, player in self.userPlayers.items()
        }
