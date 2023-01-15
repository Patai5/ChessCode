from django.http import JsonResponse


def invalid_path(request):
    return JsonResponse({"error": "Invalid path"}, status=404)
