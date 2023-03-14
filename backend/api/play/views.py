import json
import re

from django.http import JsonResponse
from rest_framework.views import APIView

from .game import ALL_ACTIVE_GAMES_MANAGER


class Game(APIView):
    def get(self, request, game_id: str):
        if not len(game_id) == 8:
            return JsonResponse({"error": "Invalid game ID length, must be 8 characters long"}, status=400)
        if re.search(r"[^a-zA-Z0-9]", game_id):
            return JsonResponse({"error": "Invalid game ID, must only contain alphanumeric characters"}, status=400)

        # Basic example of getting the game data
        # TODO: some actual game data
        game = ALL_ACTIVE_GAMES_MANAGER.get_game(game_id)
        if game is None:
            return JsonResponse({"error": "Game not found"}, status=404)

        return JsonResponse({"players": json.dumps([user.username for user in game.players])})
