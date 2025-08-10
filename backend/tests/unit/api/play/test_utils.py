import pytest
from api.friends.friends import FriendStatus
from api.play.models import Player
from api.play.utils import player_status_dict
from users.models import AnonymousSessionUser, User


def create_username_player(username: str) -> Player:
    user = User.objects.create(username=username)
    player = Player(user=user, anonymousUser=None)
    player.save()
    return player


@pytest.mark.django_db
def test_player_status_dict() -> None:
    player1 = create_username_player("user1")
    player2 = create_username_player("user2")

    anonymousUser = AnonymousSessionUser.objects.create(session_key="anonymous_session")
    anonymousPlayer = Player(anonymousUser=anonymousUser, user=None)
    anonymousPlayer.save()

    playerStatus = player_status_dict(player1, player2)
    assert playerStatus
    assert playerStatus["username"] == "user1"
    assert playerStatus["status"] == FriendStatus.notFriends.value

    playerStatus = player_status_dict(player1, player1)
    assert playerStatus
    assert playerStatus["username"] == "user1"
    assert "status" not in playerStatus

    playerStatus = player_status_dict(None, player1)
    assert playerStatus
    assert playerStatus["username"] is None
    assert "status" not in playerStatus
