from typing import Any, NotRequired, TypedDict

from django.contrib.sessions.backends.base import SessionBase
from users.models import AnonymousSessionUser

from ..friends.friends import getFriendStatus
from .models import COLORS, TERMINATIONS, Game, GameTerminations, Move, Player


class PlayerStatusDict(TypedDict):
    username: str | None
    status: NotRequired[str]


def handleGetAnonymousSessionUser(session: SessionBase) -> AnonymousSessionUser:
    """Returns the session key of the given session. If the session key does not exist, creates a new one."""
    hasSessionKey = session.session_key
    if not hasSessionKey:
        session.create()

    sessionKey = session.session_key
    if not sessionKey:
        raise ValueError("Session key is missing")

    return AnonymousSessionUser(sessionKey)


def game_to_dict(
    game: Game, include_moves: bool = True, relativeUserStatusToPlayer: Player | None = None
) -> dict[str, Any]:
    """Returns a dictionary representation of the given game."""
    gameTermination = TERMINATIONS.get(GameTerminations(game.termination))
    if gameTermination is None:
        raise ValueError(f"Invalid game termination: {game.termination}")

    return {
        "game_id": game.game_id,
        "players": {
            "white": player_status_dict(game.player_white, relativeUserStatusToPlayer),
            "black": player_status_dict(game.player_black, relativeUserStatusToPlayer),
        },
        "termination": gameTermination.name.lower(),
        "winner_color": COLORS.get(game.winner_color),
        **(
            {"moves": [move.move for move in Move.objects.filter(game=game.game_id).order_by("order")]}
            if include_moves
            else {}
        ),
        "time_control": game.time_control,
        "date": game.date,
    }


def player_status_dict(
    player: Player | None, relativeUserStatusToPlayer: Player | None = None
) -> PlayerStatusDict | None:
    """Returns a dictionary representation of the given player."""
    friendDict: PlayerStatusDict = {"username": player.user.username if player and player.user else None}

    canGetStatus = player and relativeUserStatusToPlayer
    if not canGetStatus:
        return friendDict

    isPlayerHimself = player == relativeUserStatusToPlayer
    if isPlayerHimself:
        return friendDict

    # mypy type assertion
    assert player and relativeUserStatusToPlayer

    status = getFriendStatus(relativeUserStatusToPlayer.user, player.user)
    friendDict["status"] = status.value

    return friendDict


def get_player_games_json(player: Player, page: int, limit: int, include_moves: bool = True) -> list[dict[str, Any]]:
    """Returns a list of games played by the player with the given username."""

    games = Game.getGamesByPlayer(player).order_by("-date")[limit * (page - 1) : min(limit * page, 2**63)]
    return [game_to_dict(game, include_moves) for game in games]
