from channels.generic.websocket import WebsocketConsumer


class InvalidPathConsumer(WebsocketConsumer):
    """This is consumer that disconnects any client that tries to connect to a non-existent websocket route."""

    def connect(self):
        self.close()
