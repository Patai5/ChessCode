from django.db.models import Q
from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView
from users.models import User

from ..friends.friends import getFriendStatus
from ..friends.models import FriendRequest, Friendship
from ..play.models import Game, Player
from ..play.utils import get_player_games_json


class Profile(APIView):
    def get(self, request: Request, username: str) -> JsonResponse:
        user: User | None = User.objects.filter(username=username).first()
        if user is None:
            return JsonResponse({"error": "User does not exist"}, status=400)

        joinedDate = user.date_joined
        friendsCount = Friendship.objects.filter(Q(user1=user) | Q(user2=user)).count()

        player = Player.objects.filter(user=user).first()
        gamesCount = Game.getGamesByPlayer(player).count() if player else 0

        friendRequests = None
        friendStatus = None
        if isinstance(request.user, User):
            if request.user == user:
                friendRequests = FriendRequest.objects.filter(toUser=user).count()
            else:
                friendStatus = getFriendStatus(request.user, user).value

        games = get_player_games_json(player, page=1, limit=10, include_moves=False) if player else []

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
