from django.shortcuts import render


def main(request):
    return render(request, "frontend/index.html", {})
