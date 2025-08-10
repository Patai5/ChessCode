from typing import Callable

from django.http import HttpRequest, HttpResponse


class EnsureSessionMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if not request.session.session_key:
            request.session.create()
        return self.get_response(request)
