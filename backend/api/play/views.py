from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView
from users.models import User

from ..play.players import UnknownPlayer
from ..utils import string_to_int_range
from . import serializers as s
from .game import ALL_ACTIVE_GAMES_MANAGER
from .game_queue import GROUP_QUEUE_MANAGER
from .models import Game
from .utils import game_to_dict, get_player_games_json, handleGetAnonymousSessionUser


class CreateLink(APIView):
    def get(self, request: Request) -> JsonResponse:
        serializer = s.EnqueueSerializer(data=request.GET)
        if not serializer.is_valid():
            return JsonResponse({"error": serializer.errors}, status=400)

        game_mode = serializer.data["game_mode"]
        time_control: int = serializer.validated_data["time_control"]

        queue_manager = GROUP_QUEUE_MANAGER.default
        gameQueue = queue_manager.get_game_queue(game_mode, time_control)
        if not gameQueue:
            return JsonResponse({"error": "Invalid game mode or time control"}, status=400)

        maybeRequestUser = request.user if isinstance(request.user, User) else None
        user = maybeRequestUser or handleGetAnonymousSessionUser(request.session)

        players = (user, UnknownPlayer)
        game = ALL_ACTIVE_GAMES_MANAGER.start_game(players, gameQueue.game_mode, gameQueue.time_control, link_game=True)

        return JsonResponse({"game_id": game.game_id})


class GameAPI(APIView):
    def get(self, request: Request, game_id: int) -> JsonResponse:
        try:
            game = Game.objects.get(game_id=game_id)
        except Game.DoesNotExist:
            return JsonResponse({"error": "No game found with the provided ID"}, status=404)

        user = request.user if request.user.is_authenticated else None
        gameDict = game_to_dict(game, friend_status_from_user=user)

        return JsonResponse(gameDict)


class PlayerGames(APIView):
    def get(self, request: Request, username: str) -> JsonResponse:
        limit = string_to_int_range(request.query_params.get("limit"), default=10, min=1, max=100)
        page = string_to_int_range(request.query_params.get("page"), default=1, min=1)

        games = get_player_games_json(username, page, limit)
        return JsonResponse({"games": games})
