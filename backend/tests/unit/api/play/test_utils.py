import pytest
from api.friends.friends import FriendStatus
from api.play.utils import player_status_dict
from users.models import User


@pytest.mark.django_db
def test_player_status_dict() -> None:
    user1 = User.objects.create(username="user1")
    user2 = User.objects.create(username="user2")

    playerStatus = player_status_dict(user1, user2)
    assert playerStatus["username"] == "user1"
    assert playerStatus["status"] == FriendStatus.notFriends.value

    playerStatus = player_status_dict(user1, user1)
    assert playerStatus["username"] == "user1"
    assert "status" not in playerStatus

    playerStatus = player_status_dict(None, user1)
    assert playerStatus["username"] is None
    assert "status" not in playerStatus
