from django.urls import path

from . import views as v

urlpatterns = [
    path("profile/<str:username>", v.Profile.as_view()),
]
