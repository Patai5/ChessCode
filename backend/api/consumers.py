import json
from channels.generic.websocket import WebsocketConsumer
from rest_framework.serializers import ReturnDict


class InvalidPathConsumer(WebsocketConsumer):
    """This is consumer that disconnects any client that tries to connect to a non-existent websocket route."""

    def connect(self):
        self.accept()
        self.close(code=4004)  # 404 Not Found


def error(websocket: WebsocketConsumer, message: str | ReturnDict = None, code: int = 4000):
    """
    Closes the connection with the given code.
    """
    if message is not None:
        websocket.send(text_data=json.dumps({"type": "error", "message": message}))
    websocket.close(code=code)
