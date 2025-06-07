"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

from channels.auth import AuthMiddlewareStack  # type: ignore
from channels.routing import ProtocolTypeRouter, URLRouter  # type: ignore
from channels.sessions import CookieMiddleware  # type: ignore
from django.core.asgi import get_asgi_application


def get_websocket_application() -> CookieMiddleware:
    # import here to delay until apps are loaded
    from api.urls import websocket_urlpatterns

    return AuthMiddlewareStack(URLRouter(websocket_urlpatterns))


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": get_websocket_application(),
    }
)
