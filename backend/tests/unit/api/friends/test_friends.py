import pytest
from api.friends.friend_requests import sendFriendRequest
from api.friends.friends import getFriends
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
