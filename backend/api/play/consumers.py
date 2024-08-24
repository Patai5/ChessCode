import json
import re
from typing import Any, Callable

from channels.generic.websocket import WebsocketConsumer  # type: ignore
from users.models import User

from ..consumers import error
from . import serializers as s
from .chess_board import ChessBoard, CustomOutcome, CustomTermination, get_opposite_color
from .game import ALL_ACTIVE_GAMES_MANAGER, Game, GameStatus
from .game_queue import GROUP_QUEUE_MANAGER, GameQueueManager, Group


def authenticated_user(func: Callable[..., Any]) -> Callable[..., Any]:
    """Only allow authenticated users to access the websocket"""

    def wrapper(self: "QueueConsumer", *args: Any, **kwargs: Any) -> Any:
        if not self.user.is_authenticated:
            return error(self, message="User is not authenticated", code=4001)
        return func(self, *args, **kwargs)

    return wrapper


class QueueConsumer(WebsocketConsumer):  # type: ignore
    def connect(self) -> None:
        self.user = self.scope["user"]
        self.accept()

    @authenticated_user
    def receive(self, text_data: Any) -> None:
        json_data = json.loads(text_data)
        if "type" not in json_data:
            return error(self, message="Request type is missing")

        if json_data["type"] == "enqueue":
            self.enqueue(json_data)
        elif json_data["type"] == "stop_queuing":
            self.stop_queuing()
        else:
            error(self, message="Invalid request type")

    def get_queue_manager(self, group: Group | None) -> GameQueueManager | None:
        queue_manager = GROUP_QUEUE_MANAGER.get_create_queue_manager(group)

        if not queue_manager:
            error(self, message="Invalid group")
        return queue_manager

    def enqueue(self, json_data: Any) -> None:
        serializer = s.EnqueueSerializer(data=json_data)
        if not serializer.is_valid():
            return error(self, message=serializer.errors)

        group = tuple(serializer.validated_data["group"]) if serializer.validated_data.get("group") else None
        queue_manager = self.get_queue_manager(group)
        if not queue_manager:
            return

        if queue_manager.is_player_queuing(self.user):
            return error(self, message="User is already in queue")

        game_mode = serializer.validated_data["game_mode"]
        time_control = serializer.validated_data["time_control"]
        gameQueue = queue_manager.get_game_queue(game_mode, time_control)
        if not gameQueue:
            return error(self, message="Invalid game mode or time control")

        queue_manager.add_user(self.user, gameQueue, self.game_found)

    def stop_queuing(self) -> None:
        GROUP_QUEUE_MANAGER.remove_player(self.user)

    def game_found(self, game: Game) -> None:
        self.send(json.dumps({"type": "game_found", "game_id": game.game_id}))

    def disconnect(self, code: int) -> None:
        GROUP_QUEUE_MANAGER.remove_player(self.user)
        self.close(code=code)


class GameConsumer(WebsocketConsumer):  # type: ignore
    game: Game
    user: User

    def connect(self) -> None:
        self.user = self.scope["user"]
        self.accept()

    @authenticated_user
    def receive(self, text_data: str) -> None:
        json_data = json.loads(text_data)
        if "type" not in json_data:
            return error(self, message="Request type is missing")

        type = json_data["type"]
        if type == "join":
            self.join(json_data)
        elif type == "move":
            self.move(json_data)
        elif type == "resign":
            self.resign()
        elif type == "offer_draw":
            self.offer_draw()
        else:
            error(self, message="Invalid request type")

    def join(self, json_data: Any) -> None:
        if "game_id" not in json_data:
            return error(self, message="Game ID is missing")

        game_id = json_data["game_id"]
        if not isinstance(game_id, str):
            return error(self, message="Game ID must be a string")
        if not len(game_id) == 8:
            return error(self, message="Invalid game ID length, must be 8 characters long")
        if re.search(r"[^a-zA-Z0-9]", game_id):
            return error(self, message="Invalid game ID, must only contain alphanumeric characters")

        maybeGame = ALL_ACTIVE_GAMES_MANAGER.get_game(game_id)
        if maybeGame is None:
            return error(self, message="There is no active game with the provided Game ID")
        self.game = maybeGame

        if not self.game.can_player_join(self.user):
            return error(self, message="User is not playing in this game")
        self.game.join_player(self.user, self.callback_game_state)

        self.send(
            text_data=json.dumps(
                {
                    "type": "join",
                    "players": self.game.players.to_json_dict(self.user),
                    "moves": self.game.get_moves_list(),
                    "offer_draw": self.game.players.get_opponent(self.user).offers_draw,
                    "game_started": self.game.status == GameStatus.IN_PROGRESS,
                }
            )
        )

    def move(self, json_data: Any) -> None:
        if "move" not in json_data:
            return error(self, message="Move is missing")

        move = json_data["move"]
        if not isinstance(move, str):
            return error(self, message="Move must be a string")

        if not self.game.is_players_turn(self.user):
            return error(self, message="It is not your turn")

        moveResult = self.game.move(self.user, move)
        if moveResult == ChessBoard.ILLEGAL_MOVE:
            return error(self, message="Illegal move")
        if isinstance(moveResult, CustomOutcome):
            self.send(json.dumps({"type": "outcome", "outcome": moveResult.result()}))

    def resign(self) -> None:
        user_color = self.game.players.by_user(self.user).color
        winning_color = get_opposite_color(user_color)
        self.game.finish(CustomOutcome(winner=winning_color, termination=CustomTermination.RESIGNATION))

    def offer_draw(self) -> None:
        self.game.offer_draw(self.user)

    def callback_game_state(self, type: str, changed: Any = None) -> None:
        assert type in ["game_started", "move", "game_result", "out_of_time", "offer_draw"], "Invalid type"

        if type == "game_started":
            self.send(json.dumps({"type": "game_started", "players": self.game.players.to_json_dict(self.user)}))
        elif type == "move":
            self.send(json.dumps({"type": "move", "move": changed, "players": self.game.players.to_json_dict()}))
        elif type == "game_result":
            self.send(json.dumps({"type": "game_result", "termination": changed[0], "winner": changed[1]}))
            self.disconnect()
        elif type == "offer_draw":
            self.send(json.dumps({"type": "offer_draw"}))

    def disconnect(self, code: int | None = None) -> None:
        self.close(code=code)
