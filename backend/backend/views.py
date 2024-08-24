from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from rest_framework.request import Request


class Main(View):
    def get(self, request: Request) -> HttpResponse:
        return render(request, "frontend/index.html", {})
