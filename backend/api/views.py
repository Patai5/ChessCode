from django.http import JsonResponse
from rest_framework.views import APIView


class Invalid_Path(APIView):
    def get(self, request):
        return JsonResponse({"error": "Invalid path"}, status=404)
