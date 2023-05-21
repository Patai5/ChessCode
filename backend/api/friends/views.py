from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView

from . import friends

User = get_user_model()


class FriendsList(APIView):
    def get(self, request: Request, username: str):
        user = User.objects.filter(username=username)
        if not user.exists():
            return JsonResponse({"error": "User does not exist"}, status=404)
        user = user.first()

        userFriends = friends.getFriends(user)
        return JsonResponse({"friends": [friend.username for friend in userFriends]})


def userAuthenticated(func: callable) -> JsonResponse:
    def wrapper(self, request: Request):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        return func(self, request)

    return wrapper


def validateUsername(func: callable) -> JsonResponse:
    def wrapper(self, request: Request):
        username = request.query_params.get("username")
        if not username:
            return JsonResponse({"error": "Username not provided"}, status=400)

        user = User.objects.filter(username=username)
        if not user.exists():
            return JsonResponse({"error": "User does not exist"}, status=404)

        return func(self, request, user.first())

    return wrapper


class FriendStatus(APIView):
    @userAuthenticated
    @validateUsername
    def get(self, request: Request, user: User):
        if user == request.user:
            return JsonResponse({"error": "You cannot be friends with yourself"}, status=400)
        return JsonResponse({"status": friends.areFriends(request.user, user)})
