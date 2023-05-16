from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import JsonResponse
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from . import serializers as s

User = get_user_model()


class Login(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request):
        serializer = s.LoginDetailsSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        user = authenticate(request, username=serializer.data["username"], password=serializer.data["password"])
        if user is None:
            return JsonResponse({"error": "Unauthorized"}, status=401)

        login(request, user)
        return JsonResponse({"message": "OK"}, status=200)


class Register(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "register"

    def post(self, request):
        serializer = s.RegisterDetailsSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        if User.objects.filter(username=serializer.data["username"]).exists():
            return JsonResponse({"error": "User already exists"}, status=400)

        user = User.objects.create_user(username=serializer.data["username"], password=serializer.data["password"])

        login(request, user)
        return JsonResponse({"message": "Created"}, status=201)


class Logout(APIView):
    def post(self, request):
        logout(request)
        return JsonResponse({"message": "OK"}, status=200)
