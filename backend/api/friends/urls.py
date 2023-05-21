from django.urls import path

from . import views as v

urlpatterns = [
    path("friend_status", v.FriendStatus.as_view()),
    path("<str:username>", v.FriendsList.as_view()),
]
