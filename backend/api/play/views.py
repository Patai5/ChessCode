from django.db.models import Q
from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView

from ..utils import string_to_int_range
from .models import COLORS, TERMINATIONS, Game, Move


def game_to_dict(game: Game):
    return {
        "game_id": game.game_id,
        "player_white": game.player_white.username,
        "player_black": game.player_black.username,
        "termination": TERMINATIONS.get(game.termination).name,
        "winner_color": COLORS.get(game.winner_color),
        "moves": [move.move for move in Move.objects.filter(game=game.game_id).order_by("order")],
        "date": game.date,
    }


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

        games = Game.objects.filter(
            Q(player_white__username=username) | Q(player_black__username=username),
        ).order_by(
            "-date"
        )[limit * (page - 1) : min(limit * page, 2**63)]

        return JsonResponse({"games": [game_to_dict(game) for game in games]})
