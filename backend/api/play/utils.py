from typing import Any, Literal, NotRequired, TypedDict

from django.contrib.sessions.backends.base import SessionBase
from users.models import AnonymousSessionUser, User

from ..friends.friends import getFriendStatus
from .models import COLORS, TERMINATIONS, Game, GameTerminations, Move, Player


class BasePlayerStatusDict(TypedDict):
    is_current_user: NotRequired[bool]


class RegularUserStatusDict(BasePlayerStatusDict):
    user_type: Literal["registered"]
    username: str
    status: NotRequired[str]


class AnonymousUserStatusDict(BasePlayerStatusDict):
    user_type: Literal["anonymous"]
    user_id: NotRequired[int]


PlayerStatusDict = RegularUserStatusDict | AnonymousUserStatusDict


def handleGetAnonymousSessionUser(session: SessionBase) -> AnonymousSessionUser:
    sessionKey = session.session_key
    if not sessionKey:
        raise ValueError("Session key is missing")

    existingAnonymousUser = AnonymousSessionUser.objects.filter(session_key=sessionKey).first()
    if existingAnonymousUser:
        return existingAnonymousUser

    return AnonymousSessionUser.objects.create(session_key=sessionKey)


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
    """Returns a dictionary representation of the given player.
    - Either returns `None` if the player is not given
    - Or a dictionary of a registered player, or an anonymous player
    """
    if not player:
        return None

    if player.anonymousUser:
        return get_anonymous_user_status_dict(player.anonymousUser, relativeUserStatusToPlayer)

    if not player.user:
        raise ValueError("Player must have a user or anonymousUser set.")

    return get_regular_user_status_dict(player.user, relativeUserStatusToPlayer)


def get_anonymous_user_status_dict(
    anonymousUser: AnonymousSessionUser,
    relativeUserStatusToPlayer: Player | None,
) -> AnonymousUserStatusDict:
    playerStatusDict: AnonymousUserStatusDict = {"user_type": "anonymous", "user_id": anonymousUser.id}
    if relativeUserStatusToPlayer:
        playerStatusDict["is_current_user"] = relativeUserStatusToPlayer.anonymousUser == anonymousUser

    return playerStatusDict


def get_regular_user_status_dict(
    user: User,
    relativeUserStatusToPlayer: Player | None = None,
) -> RegularUserStatusDict:
    """Returns a dictionary representation of the given user.
    - returns `is_current_user` when the `relativeUserStatusToPlayer` is set
    - return `status` which stands for the friendship relation of the user to the given player
    """
    playerStatusDict: RegularUserStatusDict = {"user_type": "registered", "username": user.username}

    if not relativeUserStatusToPlayer:
        return playerStatusDict

    isPlayerHimself = user == relativeUserStatusToPlayer.user
    if relativeUserStatusToPlayer:
        playerStatusDict["is_current_user"] = isPlayerHimself

    canGetStatus = relativeUserStatusToPlayer.user and not isPlayerHimself
    if not canGetStatus:
        return playerStatusDict

    assert relativeUserStatusToPlayer.user  # mypy type assertion

    status = getFriendStatus(relativeUserStatusToPlayer.user, user)
    playerStatusDict["status"] = status.value

    return playerStatusDict


def get_player_games_json(player: Player, page: int, limit: int, include_moves: bool = True) -> list[dict[str, Any]]:
    """Returns a list of games played by the player with the given username."""

    games = Game.getGamesByPlayer(player).order_by("-date")[limit * (page - 1) : min(limit * page, 2**63)]
    return [game_to_dict(game, include_moves) for game in games]
