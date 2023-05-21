from django.contrib.auth import get_user_model

from .models import FriendRequest, Friendship

User = get_user_model()


def getFriendRequests(user: User) -> list[User]:
    """Returns a list of users that have sent friend requests to the user"""
    requests = FriendRequest.objects.filter(toUser=user)
    return [request.fromUser for request in requests]


def getFriendRequestsSent(user: User) -> list[User]:
    """Returns a list of users that the user has sent friend requests to"""
    requests = FriendRequest.objects.filter(fromUser=user)
    return [request.toUser for request in requests]


def getFriendRequest(fromUser: User, toUser: User) -> FriendRequest | None:
    """Returns the friend request if it exists, otherwise None"""
    friendRequest = FriendRequest.objects.filter(fromUser=fromUser, toUser=toUser)
    if friendRequest.exists():
        return friendRequest.first()
    return None


def sendFriendRequest(fromUser: User, toUser: User) -> None:
    """Sends a friend request from fromUser to toUser"""
    oppositeRequest = getFriendRequest(toUser, fromUser)
    if oppositeRequest:
        oppositeRequest.delete()
        Friendship.objects.create(user1=fromUser, user2=toUser)
    else:
        FriendRequest.objects.create(fromUser=fromUser, toUser=toUser)
