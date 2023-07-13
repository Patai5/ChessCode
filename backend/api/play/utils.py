from django.contrib.auth import get_user_model
from django.db.models import Q

from ..friends.friends import getFriendStatus
from .models import COLORS, TERMINATIONS, Game, Move

User = get_user_model()


def game_to_dict(game: Game, include_moves: bool = True, friend_status_from_user: User | None = None):
    """Returns a dictionary representation of the given game."""
    return {
        "game_id": game.game_id,
        "player_white": player_status_dict(game.player_white, friend_status_from_user),
        "player_black": player_status_dict(game.player_black, friend_status_from_user),
        "termination": TERMINATIONS.get(game.termination).name.lower(),
        "winner_color": COLORS.get(game.winner_color),
        **(
            {"moves": [move.move for move in Move.objects.filter(game=game.game_id).order_by("order")]}
            if include_moves
            else {}
        ),
        "time_control": game.time_control,
        "date": game.date,
    }


def player_status_dict(player: User, friend_status_from_user: User | None = None):
    """Returns a dictionary representation of the given player."""
    friendDict = {"username": player.username}

    if friend_status_from_user:
        status = getFriendStatus(friend_status_from_user, player)
        if status:
            friendDict["status"] = status.value

    return friendDict


def get_player_games_json(username: str, page: int, limit: int, include_moves: bool = True):
    """Returns a list of games played by the player with the given username."""
    games = Game.objects.filter(
        Q(player_white__username=username) | Q(player_black__username=username),
    ).order_by(
        "-date"
    )[limit * (page - 1) : min(limit * page, 2**63)]
    return [game_to_dict(game, include_moves) for game in games]
