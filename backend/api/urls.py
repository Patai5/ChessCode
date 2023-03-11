from django.urls import include, path, re_path

from channels.routing import URLRouter
from . import views as v
from . import consumers as c

from .play import urls as play_urls

urlpatterns = [
    path("accounts/", include("api.accounts.urls")),
    path("auth/", include("api.auth.urls")),
    path("play/", include("api.play.urls")),
    re_path(r".*", v.Invalid_Path.as_view()),
]

websocket_urlpatterns = [
    re_path("/play/", URLRouter(play_urls.websocket_urlpatterns)),
    re_path(r".*", c.InvalidPathConsumer.as_asgi()),
]
