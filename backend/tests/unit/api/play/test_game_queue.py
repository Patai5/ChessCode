import pytest
from api.play.chess_board import CustomOutcome
from api.play.game import ALL_ACTIVE_GAMES_MANAGER, Game
from api.play.game_modes import GameMode, TimeControl
from api.play.game_queue import GameQueueManager
from api.play.models import Player
from chess import Termination
from users.models import AnonymousSessionUser


@pytest.mark.django_db
def test_anonymous_user_game() -> None:
    user1 = AnonymousSessionUser.objects.create(session_key="session1")
    player1 = Player.getOrCreatePlayerByUser(user1)

    user2 = AnonymousSessionUser.objects.create(session_key="session2")
    player2 = Player.getOrCreatePlayerByUser(user2)

    gameMode = GameMode("Blitz", [TimeControl(120)])
    queueManager = GameQueueManager([gameMode])
    queue = queueManager.get_game_queue("Blitz", 120)

    assert queue is not None

    addedPlayer1 = False
    addedPlayer2 = False

    def onAddPlayer1Callback(_: Game) -> None:
        nonlocal addedPlayer1
        addedPlayer1 = True

    def onAddPlayer2Callback(_: Game) -> None:
        nonlocal addedPlayer2
        addedPlayer2 = True

    queueManager.add_player(player1, queue, onAddPlayer1Callback)
    queueManager.add_player(player2, queue, onAddPlayer2Callback)

    first_game = next(iter(ALL_ACTIVE_GAMES_MANAGER.games.values()))

    outcome = CustomOutcome(Termination.CHECKMATE, None)
    first_game.finish(outcome)
    gameId = first_game.game_id
    assert gameId is not None

    ALL_ACTIVE_GAMES_MANAGER.remove_game(gameId)
