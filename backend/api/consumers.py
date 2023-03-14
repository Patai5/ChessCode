import json

from channels.generic.websocket import WebsocketConsumer
from rest_framework.serializers import ReturnDict


class InvalidPathConsumer(WebsocketConsumer):
    """This is consumer that disconnects any client that tries to connect to a non-existent websocket route."""

    def connect(self):
        self.accept()
        error(self, message="Invalid path", code=4004)  # 404 Not Found


def error(websocket: WebsocketConsumer, message: str | ReturnDict = None, code: int = None):
    """
    Sends an error message if provided, if an error code is provided, the connection will be closed with that code.
    """
    assert isinstance(websocket, WebsocketConsumer), "websocket must be an instance of WebsocketConsumer"
    assert (
        message is None or isinstance(message, str) or isinstance(message, ReturnDict)
    ), "message must be a string or ReturnDict"
    assert code is None or isinstance(code, int), "code must be an integer"

    if message is not None:
        websocket.send(text_data=json.dumps({"type": "error", "message": message}))
    if code:
        websocket.close(code=code)
