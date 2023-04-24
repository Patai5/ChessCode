import chess
from django.contrib.auth import get_user_model
from django.db import models

from .chess_board import CustomTermination

User = get_user_model()


class Move(models.Model):
    models.UniqueConstraint(name="unique_key", fields=["game", "order"])
    game = models.ForeignKey(
        "Game",
        on_delete=models.CASCADE,
    )
    order = models.IntegerField()
    move = models.CharField(max_length=5)


class GameTerminations(models.IntegerChoices):
    0, chess.Termination.CHECKMATE,
    1, chess.Termination.STALEMATE,
    2, chess.Termination.INSUFFICIENT_MATERIAL,
    3, chess.Termination.FIFTY_MOVES,
    4, chess.Termination.THREEFOLD_REPETITION,
    5, CustomTermination.TIMEOUT,
    6, CustomTermination.RESIGNATION,
    7, CustomTermination.AGREEMENT,


class Game(models.Model):
    game_id = models.CharField(max_length=8, unique=True)
    player_white = models.ForeignKey(User, related_name="player_white", on_delete=models.SET_NULL, null=True)
    player_black = models.ForeignKey(User, related_name="player_black", on_delete=models.SET_NULL, null=True)
    termination = models.IntegerField(choices=GameTerminations)


class Game_winner(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    winner = models.BooleanField()
