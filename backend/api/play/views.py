from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView

from ..utils import string_to_int_range
from .models import Game
from .utils import game_to_dict, get_player_games_json


class GameAPI(APIView):
    def get(self, request: Request, game_id: int):
        try:
            game = Game.objects.get(game_id=game_id)
        except Game.DoesNotExist:
            return JsonResponse({"error": "No game found with the provided ID"}, status=404)
        return JsonResponse(game_to_dict(game))


class PlayerGames(APIView):
    def get(self, request: Request, username: str):
        limit = string_to_int_range(request.query_params.get("limit"), default=10, min=1, max=100)
        page = string_to_int_range(request.query_params.get("page"), default=1, min=1)

        games = get_player_games_json(username, page, limit)
        return JsonResponse({"games": games})
