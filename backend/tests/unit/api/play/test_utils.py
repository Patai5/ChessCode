import pytest
from api.friends.friends import FriendStatus
from api.play.models import Game, GameTerminations, Player
from api.play.utils import get_player_games_json, player_status_dict
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
    assert playerStatus == {
        "user_type": "registered",
        "username": "user1",
        "is_current_user": False,
        "status": FriendStatus.notFriends.value,
    }

    playerStatus = player_status_dict(player1, player1)
    assert playerStatus
    assert playerStatus == {"user_type": "registered", "username": "user1", "is_current_user": True}
    assert "status" not in playerStatus

    playerStatus = player_status_dict(None, player1)
    assert playerStatus is None

    playerStatus = player_status_dict(anonymousPlayer, None)
    assert playerStatus
    assert playerStatus["user_type"] == "anonymous"
    assert playerStatus["user_id"] == 1
    assert "status" not in playerStatus


@pytest.mark.django_db
def test_get_player_games_json() -> None:
    player1 = create_username_player("user1")
    player2 = create_username_player("user2")

    anonymousUser = AnonymousSessionUser.objects.create(session_key="anonymous_session")
    anonymousPlayer = Player(anonymousUser=anonymousUser, user=None)
    anonymousPlayer.save()

    Game.objects.create(
        player_white=player1, player_black=player2, time_control=300, termination=GameTerminations.CHECKMATE
    )
    Game.objects.create(
        player_white=player2, player_black=anonymousPlayer, time_control=600, termination=GameTerminations.CHECKMATE
    )

    games = get_player_games_json(player1, page=1, limit=10)
    assert len(games) == 1
    assert games[0]["game_id"] == 1
    assert games[0]["players"]["white"] == {"user_type": "registered", "username": "user1", "is_current_user": True}
    assert games[0]["players"]["black"] == {
        "user_type": "registered",
        "username": "user2",
        "is_current_user": False,
        "status": FriendStatus.notFriends.value,
    }

    games2 = get_player_games_json(player2, page=1, limit=10)
    assert len(games2) == 2
    assert games2[0]["game_id"] == 2

    assert games2[0]["players"]["white"] == {"user_type": "registered", "username": "user2", "is_current_user": True}
    assert games2[0]["players"]["black"] == {"user_type": "anonymous", "user_id": 1, "is_current_user": False}

    assert games2[1]["game_id"] == 1
