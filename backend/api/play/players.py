import threading
import time
from typing import Any, Callable, Iterable, Literal

import chess
from api.play.models import Player
from users.models import User

from ..friends.friends import getFriendStatus
from .chess_board import CHESS_COLOR_NAMES, get_opposite_color

TimeS = float
TimeMs = int
APICallbackType = Callable[[str, Any], None]

UnknownPlayerType = Literal["UnknownPlayer"]
UnknownPlayer: UnknownPlayerType = "UnknownPlayer"


class GamePlayer:
    def __init__(
        self,
        player: Player | UnknownPlayerType,
        color: chess.Color,
        time: TimeS,
    ):
        self.player = player
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
    gamePlayersDict: dict[Player | UnknownPlayerType, GamePlayer]

    def __init__(self, players: list[GamePlayer]):
        self.gamePlayersDict = {player.player: player for player in players}

    @property
    def gamePlayers(self) -> Iterable[GamePlayer]:
        return self.gamePlayersDict.values()

    @property
    def players(self) -> Iterable[Player | UnknownPlayerType]:
        return self.gamePlayersDict.keys()

    @property
    def is_draw_agreement(self) -> bool:
        return all(player.offers_draw for player in self.gamePlayers)

    def remove_draw_offers(self) -> None:
        """Removes all draw offers from the players"""
        for player in self.gamePlayers:
            player.offers_draw = False

    def join_game(self, player: Player, callback: APICallbackType) -> None:
        """Joins the given player to the game. Replaces the UnknownPlayer if it exists"""
        if player not in self.gamePlayersDict and UnknownPlayer in self.gamePlayersDict:
            self.gamePlayersDict[player] = self.gamePlayersDict.pop(UnknownPlayer)

        self.by_player(player).join_game(callback)

    def get_opponent(self, player: Player) -> GamePlayer:
        """Gets the Player object for the opponent of the given player"""
        return self.by_color(get_opposite_color(self.by_player(player).color))

    def by_color(self, color: chess.Color) -> GamePlayer:
        """Gets the Player object for the given color"""
        players = list(self.gamePlayers)

        playerIndex = 0 if color == players[0].color else 1
        return players[playerIndex]

    def by_player(self, player: Player) -> GamePlayer:
        """Gets the Player object for the given player"""
        return self.gamePlayersDict[player]

    def to_json_dict(self, player: Player | None = None) -> dict[str, dict[str, Any]]:
        """Converts the Players object to a JSON serializable dict
        - If `friend` parameter is not None, the friend status of the users will be added to the opponent"""
        friendStatus: dict[str, Any] = {}
        if isinstance(player, User) and player in self.gamePlayersDict:
            opponent = self.get_opponent(player)
            if isinstance(opponent, User):
                friendStatus = {"opponent": getFriendStatus(player, opponent).value}

        return {
            CHESS_COLOR_NAMES[player.color]: {
                "username": colorUser.username if isinstance(colorUser, User) else None,
                "time": player.get_current_time(),
                **(friendStatus),
            }
            for colorUser, player in self.gamePlayersDict.items()
        }
