from enum import Enum

from django.db.models import Q
from users.models import User

from . import friend_requests
from .models import Friendship


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
    """Returns the status of the friendship between user1 and user2, raises an error if both users are the same user"""
    if fromUser == toUser:
        raise ValueError("User cannot be friends with itself")

    if getFriendship(fromUser, toUser):
        return FriendStatus.friends
    elif friend_requests.getFriendRequest(fromUser, toUser):
        return FriendStatus.friendRequestSent
    elif friend_requests.getFriendRequest(toUser, fromUser):
        return FriendStatus.friendRequestReceived
    else:
        return FriendStatus.notFriends


def getFriendsWithStatuses(user: User, referenceStatusUser: User) -> list[tuple[User, FriendStatus | None]]:
    """
    Returns a list of users that are friends with the given user
    - Gets the friendship status of each user in relation to the given reference user.
    """

    friends = getFriends(user)

    friendsWithStatuses: list[tuple[User, FriendStatus | None]] = []
    for friend in friends:
        isFriendSameUser = friend == referenceStatusUser
        if isFriendSameUser:
            friendsWithStatuses.append((friend, None))
            continue

        status = getFriendStatus(fromUser=referenceStatusUser, toUser=friend)
        friendsWithStatuses.append((friend, status))

    return friendsWithStatuses
