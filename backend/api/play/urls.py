from django.urls import re_path

from . import consumers as c


websocket_urlpatterns = [
    re_path("queue$", c.QueueConsumer.as_asgi()),
]
