from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.views import APIView

from .game_queue import DEFAULT_GAME_QUEUE_MANAGER
from . import serializers as s

User = get_user_model()


class Enqueue(APIView):
    def get(self, request):
        serializer = s.EnqueueSerializer(data=request.query_params)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        if not request.user.is_authenticated:
            return JsonResponse({"message": "User is not authenticated"}, status=401)

        if DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(request.user):
            return JsonResponse({"message": "User is already in queue"}, status=400)

        game_mode = serializer.validated_data["game_mode"]
        time_control = serializer.validated_data["time_control"]
        gameQueue = DEFAULT_GAME_QUEUE_MANAGER.get_game_queue(game_mode, time_control)
        if not gameQueue:
            return JsonResponse({"message": "Invalid game mode or time control"}, status=400)

        DEFAULT_GAME_QUEUE_MANAGER.add_user(request.user, gameQueue)

        return JsonResponse({"message": "OK"}, status=200)


class StopQueuing(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"message": "User is not authenticated"}, status=401)

        if not DEFAULT_GAME_QUEUE_MANAGER.is_player_queuing(request.user):
            return JsonResponse({"message": "User is not in queue"}, status=400)

        DEFAULT_GAME_QUEUE_MANAGER.remove_user(request.user)
        return JsonResponse({"message": "OK"}, status=200)
