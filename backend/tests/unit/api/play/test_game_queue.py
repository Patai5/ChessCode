import pytest
from api.play.chess_board import CustomOutcome
from api.play.game import ALL_ACTIVE_GAMES_MANAGER, Game
from api.play.game_modes import GameMode, TimeControl
from api.play.game_queue import GameQueueManager
from chess import Termination
from users.models import AnonymousSessionUser


@pytest.mark.django_db
def test_anonymous_user_game() -> None:
    user1 = AnonymousSessionUser.objects.create(session_key="session1")
    user2 = AnonymousSessionUser.objects.create(session_key="session2")

    gameMode = GameMode("Blitz", [TimeControl(120)])
    queueManager = GameQueueManager([gameMode])
    queue = queueManager.get_game_queue("Blitz", 120)

    assert queue is not None

    addedUser1 = False
    addedUser2 = False

    def onAddUser1Callback(_: Game) -> None:
        nonlocal addedUser1
        addedUser1 = True

    def onAddUser2Callback(_: Game) -> None:
        nonlocal addedUser2
        addedUser2 = True

    queueManager.add_user(user1, queue, onAddUser1Callback)
    queueManager.add_user(user2, queue, onAddUser2Callback)

    first_game = next(iter(ALL_ACTIVE_GAMES_MANAGER.games.values()))

    outcome = CustomOutcome(Termination.CHECKMATE, None)
    first_game.finish(outcome)
    gameId = first_game.game_id
    assert gameId is not None

    ALL_ACTIVE_GAMES_MANAGER.remove_game(gameId)
