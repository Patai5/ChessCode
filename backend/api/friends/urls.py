from django.urls import path

from . import views as v

urlpatterns = [
    path("friend_request", v.FriendRequest.as_view()),
    path("friend_requests_sent", v.FriendRequestsSent.as_view()),
    path("friend_requests", v.FriendRequests.as_view()),
    path("friend", v.Friend.as_view()),
    path("with_statuses/<str:username>", v.FriendsWithStatusesList.as_view()),
    path("<str:username>", v.FriendsList.as_view()),
]
