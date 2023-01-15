from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth import login as django_login
from django.http import JsonResponse
from rest_framework.decorators import api_view

from . import serializers as s

User = get_user_model()


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


@api_view(["POST"])
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method Not Allowed"}, status=405)

    serializer = s.AuthDetailsSerializer(data=request.data)
    if not serializer.is_valid():
        return JsonResponse(serializer.errors, status=400)

    if User.objects.filter(username=serializer.data["username"]).exists():
        return JsonResponse({"error": "User already exists"}, status=400)

    user = User.objects.create_user(username=serializer.data["username"], password=serializer.data["password"])

    django_login(request, user)
    return JsonResponse({"message": "Created"}, status=201)
