from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView


class Invalid_Path(APIView):
    def get(self, request: Request) -> JsonResponse:
        return JsonResponse({"error": "Invalid path"}, status=404)
