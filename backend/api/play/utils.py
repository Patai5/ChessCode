from typing import Any

from django.db.models import Q
from users.models import User

from ..friends.friends import getFriendStatus
from .models import COLORS, TERMINATIONS, Game, GameTerminations, Move


def game_to_dict(game: Game, include_moves: bool = True, friend_status_from_user: User | None = None) -> dict[str, Any]:
    """Returns a dictionary representation of the given game."""
    gameTermination = TERMINATIONS.get(GameTerminations(game.termination))
    if gameTermination is None:
        raise ValueError(f"Invalid game termination: {game.termination}")

    return {
        "game_id": game.game_id,
        "players": {
            "white": player_status_dict(game.player_white, friend_status_from_user),
            "black": player_status_dict(game.player_black, friend_status_from_user),
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


def player_status_dict(player: User | None, friend_status_from_user: User | None = None) -> dict[str, Any]:
    """Returns a dictionary representation of the given player."""
    friendDict = {"username": player.username if player else None}

    if friend_status_from_user:
        status = getFriendStatus(friend_status_from_user, player) if player else None
        if status:
            friendDict["status"] = status.value

    return friendDict


def get_player_games_json(username: str, page: int, limit: int, include_moves: bool = True) -> list[dict[str, Any]]:
    """Returns a list of games played by the player with the given username."""
    games = Game.objects.filter(
        Q(player_white__username=username) | Q(player_black__username=username),
    ).order_by(
        "-date"
    )[limit * (page - 1) : min(limit * page, 2**63)]
    return [game_to_dict(game, include_moves) for game in games]
