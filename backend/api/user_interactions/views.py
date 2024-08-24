from django.db.models import Q
from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView
from users.models import User

from ..friends.friends import getFriendStatus
from ..friends.models import FriendRequest, Friendship
from ..play.models import Game
from ..play.utils import get_player_games_json


class Profile(APIView):
    def get(self, request: Request, username: str) -> JsonResponse:
        user: User | None = User.objects.filter(username=username).first()
        if user is None:
            return JsonResponse({"error": "User does not exist"}, status=400)

        joinedDate = user.date_joined
        friendsCount = Friendship.objects.filter(Q(user1=user) | Q(user2=user)).count()
        gamesCount = Game.objects.filter(
            Q(player_white__username=username) | Q(player_black__username=username),
        ).count()

        friendRequests = None
        friendStatus = None
        if isinstance(request.user, User):
            if request.user == user:
                friendRequests = FriendRequest.objects.filter(toUser=user).count()
            else:
                friendStatus = getFriendStatus(request.user, user).value

        games = get_player_games_json(username, 1, 10, include_moves=False)

        return JsonResponse(
            {
                "date_joined": joinedDate,
                "total_friends": friendsCount,
                "total_games": gamesCount,
                **({"friend_status": friendStatus} if friendStatus is not None else {}),
                **({"friend_requests": friendRequests} if friendRequests is not None else {}),
                "games": games,
            }
        )
