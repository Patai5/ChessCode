from django.contrib.auth.models import AnonymousUser
from users.models import User

from .models import FriendRequest, Friendship


def getFriendRequests(user: User | AnonymousUser) -> list[User]:
    """Returns a list of users that have sent friend requests to the user"""
    requests = FriendRequest.objects.filter(toUser=user)
    return [request.fromUser for request in requests]


def getFriendRequestsSent(user: User | AnonymousUser) -> list[User]:
    """Returns a list of users that the user has sent friend requests to"""
    requests = FriendRequest.objects.filter(fromUser=user)
    return [request.toUser for request in requests]


def getFriendRequest(fromUser: User | AnonymousUser, toUser: User | AnonymousUser) -> FriendRequest | None:
    """Returns the friend request if it exists, otherwise None"""
    friendRequest = FriendRequest.objects.filter(fromUser=fromUser, toUser=toUser)
    if friendRequest.exists():
        return friendRequest.first()
    return None


def sendFriendRequest(fromUser: User | AnonymousUser, toUser: User) -> None:
    """Sends a friend request from fromUser to toUser"""
    oppositeRequest = getFriendRequest(toUser, fromUser)
    if oppositeRequest:
        oppositeRequest.delete()
        Friendship.objects.create(user1=fromUser, user2=toUser)
    else:
        FriendRequest.objects.create(fromUser=fromUser, toUser=toUser)
