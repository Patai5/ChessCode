from django.urls import path, re_path

from . import consumers as c
from . import views as v

urlpatterns = [
    path("create_link", v.CreateLink.as_view()),
    path("game/<int:game_id>", v.GameAPI.as_view()),
    path("player_games/<str:username>", v.PlayerGames.as_view()),
]
websocket_urlpatterns = [
    re_path("[a-zA-Z0-9]{8}$", c.GameConsumer.as_asgi()),
    re_path("queue$", c.QueueConsumer.as_asgi()),
]
