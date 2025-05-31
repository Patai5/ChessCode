from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from django.http import HttpRequest


class Main(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, "frontend/index.html", {})
