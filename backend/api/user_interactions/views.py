from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.views import APIView

from ..play.utils import get_player_games_json

User = get_user_model()


class Profile(APIView):
    def get(self, request, username: str):
        user = User.objects.filter(username=username)
        if not user.exists():
            return JsonResponse({"error": "User does not exist"}, status=400)

        games = get_player_games_json(username, 1, 10, include_moves=False)
        return JsonResponse({"date_joined": user.get().date_joined, "games": games})
