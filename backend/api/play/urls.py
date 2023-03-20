from django.urls import re_path

from . import consumers as c

websocket_urlpatterns = [
    re_path("[a-zA-Z0-9]{8}$", c.GameConsumer.as_asgi()),
    re_path("queue$", c.QueueConsumer.as_asgi()),
]
