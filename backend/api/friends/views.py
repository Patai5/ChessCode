from typing import Any, Callable

from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView
from users.models import User

from . import friend_requests, friends
from .friends import FriendStatus


class AuthenticatedUserRequest(Request):
    user: User


class FriendsList(APIView):
    def get(self, request: Request, username: str) -> JsonResponse:
        user = User.objects.filter(username=username).first()
        if user is None:
            return JsonResponse({"error": "User does not exist"}, status=404)

        userFriends = friends.getFriends(user)
        return JsonResponse({"friends": [friend.username for friend in userFriends]})


def userAuthenticated(
    func: JsonResponse | Callable[..., JsonResponse | None]
) -> JsonResponse | Callable[..., JsonResponse | None]:
    if isinstance(func, JsonResponse):
        return func

    def wrapper(self: APIView, request: Request, *args: Any, **kwargs: Any) -> JsonResponse | None:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in"}, status=401)

        return func(self, request, *args, **kwargs)

    return wrapper


def parseUsernameFromRequest(
    func: JsonResponse | Callable[..., JsonResponse | None]
) -> JsonResponse | Callable[..., JsonResponse | None]:
    if isinstance(func, JsonResponse):
        return func

    def wrapper(self: APIView, request: Request) -> JsonResponse | None:
        username = request.query_params.get("username")
        if not username:
            return JsonResponse({"error": "Username not provided"}, status=400)

        return func(self, request, username)

    return wrapper


def parseUsernameFromUrl(
    func: JsonResponse | Callable[..., JsonResponse | None]
) -> JsonResponse | Callable[..., JsonResponse | None]:
    if isinstance(func, JsonResponse):
        return func

    def wrapper(self: APIView, request: Request, username: str) -> JsonResponse | None:
        return func(self, request, username)

    return wrapper


def validateUsername(
    func: JsonResponse | Callable[..., JsonResponse | None]
) -> JsonResponse | Callable[..., JsonResponse | None]:
    if isinstance(func, JsonResponse):
        return func

    def wrapper(self: APIView, request: Request, username: str) -> JsonResponse | None:
        user = User.objects.filter(username=username)
        if not user.exists():
            return JsonResponse({"error": "User does not exist"}, status=404)

        return func(self, request, user.first())

    return wrapper


def validateNotYourself(
    func: JsonResponse | Callable[..., JsonResponse | None]
) -> JsonResponse | Callable[..., JsonResponse | None]:
    if isinstance(func, JsonResponse):
        return func

    def wrapper(self: APIView, request: Request, user: User) -> JsonResponse | None:
        if request.user == user:
            return JsonResponse({"error": "Cannot be friends with yourself"}, status=400)

        return func(self, request, user)

    return wrapper


class FriendsWithStatusesList(APIView):
    @userAuthenticated
    @parseUsernameFromUrl
    @validateUsername
    def get(self, request: AuthenticatedUserRequest, username: str) -> JsonResponse:
        user = User.objects.filter(username=username).first()
        if user is None:
            return JsonResponse({"error": "User does not exist"}, status=404)

        userFriends = friends.getFriendsWithStatuses(request.user, user)
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
    def get(self, request: AuthenticatedUserRequest, user: User) -> JsonResponse:
        return JsonResponse({"success": friends.getFriendStatus(request.user, user).value})

    @userAuthenticated
    @parseUsernameFromRequest
    @validateUsername
    @validateNotYourself
    def delete(self, request: AuthenticatedUserRequest, user: User) -> JsonResponse:
        friendship = friends.getFriendship(request.user, user)
        if not friendship:
            return JsonResponse({"error": "You are not friends with this user"}, status=400)

        friendship.delete()
        return JsonResponse({"success": True})


def friendRequestValid(func: Callable[..., JsonResponse | None]) -> JsonResponse | Callable[..., JsonResponse | None]:
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
    def wrapper(self: APIView, request: AuthenticatedUserRequest, user: User) -> JsonResponse | None:
        if friends.getFriendship(request.user, user):
            return JsonResponse({"error": "You are already friends"}, status=400)

        return func(self, request, user)

    return wrapper


class FriendRequests(APIView):
    @userAuthenticated
    def get(self, request: Request) -> JsonResponse:
        users = friend_requests.getFriendRequests(request.user)
        return JsonResponse({"friend_requests": [user.username for user in users]})


class FriendRequestsSent(APIView):
    @userAuthenticated
    def get(self, request: Request) -> JsonResponse:
        users = friend_requests.getFriendRequestsSent(request.user)
        return JsonResponse({"friend_requests": [user.username for user in users]})


class FriendRequest(APIView):
    @friendRequestValid
    def post(self, request: Request, user: User) -> JsonResponse:
        if friend_requests.getFriendRequest(request.user, user):
            return JsonResponse({"error": "Friend request already sent"}, status=400)

        friend_requests.sendFriendRequest(request.user, user)
        return JsonResponse({"success": True})

    @friendRequestValid
    def delete(self, request: Request, user: User) -> JsonResponse:
        friendRequest = friend_requests.getFriendRequest(request.user, user)
        if not friendRequest:
            return JsonResponse({"error": "Friend request does not exist"}, status=404)

        friendRequest.delete()
        return JsonResponse({"success": True})


class DeclineFriendRequest:
    @friendRequestValid
    def post(self, request: Request, user: User) -> JsonResponse:
        friendRequest = friend_requests.getFriendRequest(user, request.user)
        if not friendRequest:
            return JsonResponse({"error": "Friend request does not exist"}, status=404)

        friendRequest.delete()
        return JsonResponse({"success": True})
