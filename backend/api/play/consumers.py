import json
from channels.generic.websocket import WebsocketConsumer
from ..consumers import error
from . import serializers as s
from .game_queue import DEFAULT_GAME_QUEUE_MANAGER


class QueueConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        self.accept()

    def receive(self, text_data):
        if not self.user.is_authenticated:
            return error(self, message="User is not authenticated", code=4001)

        json_data = json.loads(text_data)
        if "type" not in json_data:
            return error(self, message="Request type is missing", code=4000)

        if json_data["type"] == "enqueue":
            self.enqueue(json_data)
        elif json_data["type"] == "stop_queuing":
            self.stop_queuing(json_data)
        else:
            error(self, message="Invalid request type", code=4000)

    def enqueue(self, json_data: dict):
        serializer = s.EnqueueSerializer(data=json_data)
        if not serializer.is_valid():
            return error(self, message=serializer.errors, code=4000)

        if DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(self.user):
            return error(self, message="User is already in queue", code=4000)

        game_mode = serializer.validated_data["game_mode"]
        time_control = serializer.validated_data["time_control"]
        gameQueue = DEFAULT_GAME_QUEUE_MANAGER.get_game_queue(game_mode, time_control)
        if not gameQueue:
            return error(self, message="Invalid game mode or time control", code=4000)

        print("ADDED TO QUEEEEEE")

        DEFAULT_GAME_QUEUE_MANAGER.add_user(self.user, gameQueue)

    def stop_queuing(self, json_data: dict):
        if not DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(self.user):
            return error(self, message="User is not in queue", code=4000)

        print("REMOVED FROM QUEEEEEE")

        DEFAULT_GAME_QUEUE_MANAGER.remove_user(self.user)

    def disconnect(self, code):
        print("DISCOnnectinggggg")
        if DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(self.user):
            DEFAULT_GAME_QUEUE_MANAGER.remove_user(self.user)

        self.close(code=code)
