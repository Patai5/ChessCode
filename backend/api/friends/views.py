from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView

from . import friend_requests, friends
from .friends import FriendStatus

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
    def wrapper(self, request: Request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        return func(self, request, *args, **kwargs)

    return wrapper


def parseUsernameFromRequest(func: callable) -> JsonResponse:
    def wrapper(self, request: Request):
        username = request.query_params.get("username")
        if not username:
            return JsonResponse({"error": "Username not provided"}, status=400)

        return func(self, request, username)

    return wrapper


def parseUsernameFromUrl(func: callable) -> JsonResponse:
    def wrapper(self, request: Request, username: str):
        return func(self, request, username)

    return wrapper


def validateUsername(func: callable) -> JsonResponse:
    def wrapper(self, request: Request, username: str):
        user = User.objects.filter(username=username)
        if not user.exists():
            return JsonResponse({"error": "User does not exist"}, status=404)

        return func(self, request, user.first())

    return wrapper


def validateNotYourself(func: callable) -> JsonResponse:
    def wrapper(self, request: Request, user: User):
        if request.user == user:
            return JsonResponse({"error": "Cannot be friends with yourself"}, status=400)

        return func(self, request, user)

    return wrapper


class FriendsWithStatusesList(APIView):
    @userAuthenticated
    @parseUsernameFromUrl
    @validateUsername
    def get(self, request: Request, username: str):
        userFriends = friends.getFriendsWithStatuses(request.user, username)
        return JsonResponse(
            {
                "friends": {
                    friend[0].username: friend[1].value if isinstance(friend[1], FriendStatus) else None
                    for friend in userFriends
                }
            }
        )


class Friend(APIView):
    @userAuthenticated
    @parseUsernameFromRequest
    @validateUsername
    @validateNotYourself
    def get(self, request: Request, user: User):
        return JsonResponse({"success": friends.getFriendStatus(request.user, user).value})

    @userAuthenticated
    @parseUsernameFromRequest
    @validateUsername
    @validateNotYourself
    def delete(self, request: Request, user: User):
        friendship = friends.getFriendship(request.user, user)
        if not friendship:
            return JsonResponse({"error": "You are not friends with this user"}, status=400)

        friendship.delete()
        return JsonResponse({"success": True})


def validateNotFriendsWithUser(func: callable) -> JsonResponse:
    def wrapper(self, request: Request, user: User):
        if friends.getFriendship(request.user, user):
            return JsonResponse({"error": "You are already friends"}, status=400)

        return func(self, request, user)

    return wrapper


def friendRequestValid(func: callable) -> JsonResponse:
    """Validates that:
    - user is authenticated
    - username is provided
    - the provided user exists
    - request user is not the same as the provided user
    - request user is not already friends with the provided user"""

    @userAuthenticated
    @parseUsernameFromRequest
    @validateUsername
    @validateNotYourself
    @validateNotFriendsWithUser
    def wrapper(self, request: Request, user: User):
        return func(self, request, user)

    return wrapper


class FriendRequests(APIView):
    @userAuthenticated
    def get(self, request: Request):
        users = friend_requests.getFriendRequests(request.user)
        return JsonResponse({"friend_requests": [user.username for user in users]})


class FriendRequestsSent(APIView):
    @userAuthenticated
    def get(self, request: Request):
        users = friend_requests.getFriendRequestsSent(request.user)
        return JsonResponse({"friend_requests": [user.username for user in users]})


class FriendRequest(APIView):
    @friendRequestValid
    def post(self, request: Request, user: User):
        if friend_requests.getFriendRequest(request.user, user):
            return JsonResponse({"error": "Friend request already sent"}, status=400)

        friend_requests.sendFriendRequest(request.user, user)
        return JsonResponse({"success": True})

    @friendRequestValid
    def delete(self, request: Request, user: User):
        friendRequest = friend_requests.getFriendRequest(request.user, user)
        if not friendRequest:
            return JsonResponse({"error": "Friend request does not exist"}, status=404)

        friendRequest.delete()
        return JsonResponse({"success": True})


class DeclineFriendRequest:
    @friendRequestValid
    def post(self, request: Request, user: User):
        friendRequest = friend_requests.getFriendRequest(user, request.user)
        if not friendRequest:
            return JsonResponse({"error": "Friend request does not exist"}, status=404)

        friendRequest.delete()
        return JsonResponse({"success": True})
