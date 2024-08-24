import json
from typing import Any

from channels.generic.websocket import WebsocketConsumer  # type: ignore
from rest_framework.utils.serializer_helpers import ReturnDict


class InvalidPathConsumer(WebsocketConsumer):  # type: ignore
    """This is consumer that disconnects any client that tries to connect to a non-existent websocket route."""

    def connect(self) -> None:
        self.accept()
        error(self, message="Invalid path", code=4004)  # 404 Not Found


def error(websocket: WebsocketConsumer, message: str | ReturnDict[str, Any], code: int | None = None) -> None:
    """
    Sends an error message if provided, if an error code is provided, the connection will be closed with that code.
    """

    websocket.send(text_data=json.dumps({"type": "error", "message": message}))

    if code:
        websocket.close(code=code)
