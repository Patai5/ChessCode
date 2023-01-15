from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.http import JsonResponse
from rest_framework.decorators import api_view

from . import serializers as s


@api_view(["POST"])
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method Not Allowed"}, status=405)

    serializer = s.AuthDetailsSerializer(data=request.data)
    if not serializer.is_valid():
        return JsonResponse(serializer.errors, status=400)

    user = authenticate(request, username=serializer.data["username"], password=serializer.data["password"])
    if user is None:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    django_login(request, user)
    return JsonResponse({"message": "OK"}, status=200)
