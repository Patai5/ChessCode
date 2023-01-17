from django.shortcuts import render
from django.views import View


class Main(View):
    def get(self, request):
        return render(request, "frontend/index.html", {})
