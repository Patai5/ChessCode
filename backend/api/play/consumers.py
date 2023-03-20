import json
import re
from typing import Any

import chess
from channels.generic.websocket import WebsocketConsumer

from ..consumers import error
from . import serializers as s
from .chess_board import ChessBoard
from .game import ALL_ACTIVE_GAMES_MANAGER, Game
from .game_queue import DEFAULT_GAME_QUEUE_MANAGER


def authenticated_user(func):
    """Only allow authenticated users to access the websocket"""

    def wrapper(self, *args, **kwargs):
        if not self.user.is_authenticated:
            return error(self, message="User is not authenticated", code=4001)
        return func(self, *args, **kwargs)

    return wrapper


class QueueConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        self.accept()

    @authenticated_user
    def receive(self, text_data):
        json_data = json.loads(text_data)
        if "type" not in json_data:
            return error(self, message="Request type is missing")

        if json_data["type"] == "enqueue":
            self.enqueue(json_data)
        elif json_data["type"] == "stop_queuing":
            self.stop_queuing(json_data)
        else:
            error(self, message="Invalid request type")

    def enqueue(self, json_data: dict):
        serializer = s.EnqueueSerializer(data=json_data)
        if not serializer.is_valid():
            return error(self, message=serializer.errors)

        if DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(self.user):
            return error(self, message="User is already in queue")

        game_mode = serializer.validated_data["game_mode"]
        time_control = serializer.validated_data["time_control"]
        gameQueue = DEFAULT_GAME_QUEUE_MANAGER.get_game_queue(game_mode, time_control)
        if not gameQueue:
            return error(self, message="Invalid game mode or time control")

        DEFAULT_GAME_QUEUE_MANAGER.add_user(self.user, gameQueue, self.game_found)

    def stop_queuing(self, json_data: dict):
        if not DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(self.user):
            return error(self, message="User is not in queue")

        DEFAULT_GAME_QUEUE_MANAGER.remove_user(self.user)

    def game_found(self, game: Game):
        self.send(json.dumps({"type": "game_found", "game_id": game.game_id}))

    def disconnect(self, code):
        if DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(self.user):
            DEFAULT_GAME_QUEUE_MANAGER.remove_user(self.user)

        self.close(code=code)


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        self.accept()

    @authenticated_user
    def receive(self, text_data):
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

    def join(self, json_data: dict):
        if "game_id" not in json_data:
            return error(self, message="Game ID is missing")

        game_id = json_data["game_id"]
        if not isinstance(game_id, str):
            return error(self, message="Game ID must be a string")
        if not len(game_id) == 8:
            return error(self, message="Invalid game ID length, must be 8 characters long")
        if re.search(r"[^a-zA-Z0-9]", game_id):
            return error(self, message="Invalid game ID, must only contain alphanumeric characters")

        game = ALL_ACTIVE_GAMES_MANAGER.get_game(game_id)
        if game is None:
            return error(self, message="There is no active game with the provided Game ID")

        if not self.user in game.players:
            return error(self, message="User is not playing in this game")

        self.game = game
        self.game.add_api_callback(self.user, self.callback_game_state)

    def move(self, json_data: dict):
        # TODO: Only allow to control your own pieces, also check if it's your turn
        if "move" not in json_data:
            return error(self, message="Move is missing")

        move = json_data["move"]
        if not isinstance(move, str):
            return error(self, message="Move must be a string")

        moveResult = self.game.move(move)
        if moveResult is ChessBoard.ILLEGAL_MOVE:
            return error(self, message="Illegal move")
        if moveResult is chess.Outcome:
            self.send(json.dumps({"type": "outcome", "outcome": moveResult.result()}))

    def resign(self):
        # TODO: Implement resignation of the right color
        self.game.callback_game_result(chess.Outcome(winner=chess.WHITE, termination=chess.Termination.VARIANT_WIN))

    def offer_draw(self):
        # TODO: Implement both players accepting the draw
        self.game.callback_game_result(chess.Outcome(winner=None, termination=chess.Termination.VARIANT_DRAW))

    def callback_game_state(self, type: str, changed: Any):
        assert type in ["move", "game_result"], "Invalid type"

        if type == "move":
            self.send(json.dumps({"type": "move", "move": changed}))
        elif type == "game_result":
            self.send(json.dumps({"type": "game_result", "game_result": changed}))

    def disconnect(self, code):
        self.close(code=code)
