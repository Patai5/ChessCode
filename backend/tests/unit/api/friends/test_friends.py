import pytest
from api.friends.friend_requests import sendFriendRequest
from api.friends.friends import FriendStatus, getFriends, getFriendsWithStatuses
from users.models import User


@pytest.mark.django_db
def test_sendFriendRequest() -> None:
    user1 = User.objects.create(username="user1")
    user2 = User.objects.create(username="user2")

    noFriends = getFriends(user1)
    assert len(noFriends) == 0

    sendFriendRequest(fromUser=user1, toUser=user2)
    sendFriendRequest(fromUser=user2, toUser=user1)

    friends1 = getFriends(user1)
    assert len(friends1) == 1

    friends2 = getFriends(user2)
    assert len(friends2) == 1


@pytest.mark.django_db
def test_getFriendsWithStatuses() -> None:
    user1 = User.objects.create(username="user1")
    user2 = User.objects.create(username="user2")
    user3 = User.objects.create(username="user3")
    user4 = User.objects.create(username="user4")

    sendFriendRequest(fromUser=user1, toUser=user2)
    sendFriendRequest(fromUser=user2, toUser=user1)

    sendFriendRequest(fromUser=user1, toUser=user3)
    sendFriendRequest(fromUser=user3, toUser=user1)

    friendsWithStatuses1 = getFriendsWithStatuses(user=user1, referenceStatusUser=user3)
    assert len(friendsWithStatuses1) == 2

    assert friendsWithStatuses1[0][0] == user2
    assert friendsWithStatuses1[0][1] == FriendStatus.notFriends

    assert friendsWithStatuses1[1][0] == user3
    assert friendsWithStatuses1[1][1] == None

    friendsWithStatuses2 = getFriendsWithStatuses(user=user3, referenceStatusUser=user2)
    assert len(friendsWithStatuses2) == 1

    assert friendsWithStatuses2[0][0] == user1
    assert friendsWithStatuses2[0][1] == FriendStatus.friends

    friendsWithStatuses3 = getFriendsWithStatuses(user=user4, referenceStatusUser=user1)
    assert len(friendsWithStatuses3) == 0
