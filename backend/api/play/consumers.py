import json

from channels.generic.websocket import WebsocketConsumer

from ..consumers import error
from . import serializers as s
from .game import Game
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
