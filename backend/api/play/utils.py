from django.db.models import Q

from .models import COLORS, TERMINATIONS, Game, Move


def game_to_dict(game: Game, include_moves: bool = True):
    """Returns a dictionary representation of the given game."""
    return {
        "game_id": game.game_id,
        "player_white": game.player_white.username,
        "player_black": game.player_black.username,
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


def get_player_games_json(username: str, page: int, limit: int, include_moves: bool = True):
    """Returns a list of games played by the player with the given username."""
    games = Game.objects.filter(
        Q(player_white__username=username) | Q(player_black__username=username),
    ).order_by(
        "-date"
    )[limit * (page - 1) : min(limit * page, 2**63)]
    return [game_to_dict(game, include_moves) for game in games]
