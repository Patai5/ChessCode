from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.views import APIView

from . import serializers as s

User = get_user_model()


class UserExists(APIView):
    def get(self, request):
        data = {"username": request.query_params.get("username")}
        serializer = s.Username(data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        if User.objects.filter(username=serializer.data["username"]).exists():
            return JsonResponse({"user-exists": True})
        else:
            return JsonResponse({"user-exists": False})
