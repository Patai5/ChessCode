import threading
import time
from typing import Callable, Iterable, Optional

import chess
from django.contrib.auth import get_user_model

from ..friends.friends import getFriendStatus
from .chess_board import CHESS_COLOR_NAMES, get_opposite_color

User = get_user_model()

TimeS = float
TimeMs = int
APICallbackType = Callable[[str, any], None]
UnknownPlayer = Optional[None]


class Player:
    def __init__(
        self,
        user: User | UnknownPlayer,
        color: chess.Color,
        time: TimeS,
    ):
        self.user = user
        self.color = color
        self.time = time

        self.joined = False
        self.offers_draw = False
        self.timer = None
        self.timer_start = None

    def api_callback(self, type: str, changed: any = None):
        """Calls the API callback"""
        if self.joined:
            self._api_callback(type, changed)

    def join_game(self, user: User, callback: APICallbackType):
        """Joins the player to the game and adds an API callback"""
        if isinstance(self.user, UnknownPlayer):
            self.user = user

        self.joined = True
        self._api_callback = callback

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

    def __init__(self, players: list[Player]):
        self.userPlayers = {player.user: player for player in players}

    @property
    def players(self) -> Iterable[Player]:
        return self.userPlayers.values()

    @property
    def users(self) -> Iterable[User]:
        return self.userPlayers.keys()

    @property
    def is_draw_agreement(self) -> bool:
        return all(player.offers_draw for player in self.players)

    def remove_draw_offers(self):
        """Removes all draw offers from the players"""
        for player in self.players:
            player.offers_draw = False

    def join_game(self, user: User, callback: APICallbackType):
        """Joins the given user to the game. Replaces the UnknownPlayer if it exists"""
        if user not in self.userPlayers and None in self.userPlayers:
            self.userPlayers[user] = self.userPlayers.pop(None)

        self.by_user(user).join_game(user, callback)

    def get_opponent(self, user: User):
        """Gets the Player object for the opponent of the given user"""
        return self.by_color(get_opposite_color(self.by_user(user).color))

    def by_color(self, color: chess.Color):
        """Gets the Player object for the given color"""
        for player in self.players:
            if player.color == color:
                return player

    def by_user(self, user: User):
        """Gets the Player object for the given user"""
        return self.userPlayers[user]

    def to_json_dict(self, friend: User | None = None):
        """Converts the Players object to a JSON serializable dict
        - If `friend` parameter is not None, the friend status of the users will be added to the opponent"""
        return {
            CHESS_COLOR_NAMES[player.color]: {
                "username": user.username if isinstance(user, User) else None,
                "time": player.get_current_time(),
                **(
                    {"friend_status": getFriendStatus(friend, player.user).value}
                    if isinstance(player.user, User) and friend != player.user
                    else {}
                ),
            }
            for user, player in self.userPlayers.items()
        }
