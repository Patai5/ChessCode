from django.urls import path, re_path

from . import consumers as c
from . import views as v

urlpatterns = [
    path("<str:game_id>", v.Game.as_view()),
]


websocket_urlpatterns = [
    re_path("queue$", c.QueueConsumer.as_asgi()),
]
