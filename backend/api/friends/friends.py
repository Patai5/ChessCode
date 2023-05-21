from enum import Enum

from django.contrib.auth import get_user_model
from django.db.models import Q

from . import friend_requests
from .models import Friendship

User = get_user_model()


def getFriends(user: User) -> list[User]:
    """Returns a list of users that are friends with the user"""
    friendships = Friendship.objects.filter(Q(user1=user) | Q(user2=user))
    return [friendship.get_friend(user) for friendship in friendships]


def getFriendship(user1: User, user2: User) -> Friendship | None:
    """Return the friendship between user1 and user2 if it exists, otherwise None"""
    friendships = Friendship.objects.filter(Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1))
    if not friendships.exists():
        return None
    return friendships.first()


class FriendStatus(Enum):
    friends = "friends"
    notFriends = "not_friends"
    friendRequestSent = "friend_request_sent"
    friendRequestReceived = "friend_request_received"


def getFriendStatus(fromUser: User, toUser: User) -> FriendStatus:
    """Returns the status of the friendship between user1 and user2"""
    if getFriendship(fromUser, toUser):
        return FriendStatus.friends
    elif friend_requests.getFriendRequest(fromUser, toUser):
        return FriendStatus.friendRequestSent
    elif friend_requests.getFriendRequest(toUser, fromUser):
        return FriendStatus.friendRequestReceived
    else:
        return FriendStatus.notFriends
