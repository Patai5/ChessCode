from __future__ import annotations

from typing import Any

import chess
from django.db import models
from users.models import AnonymousSessionUser, User

from .chess_board import CustomTermination


class GameTerminations(models.IntegerChoices):
    CHECKMATE = 0, "CHECKMATE"
    STALEMATE = 1, "STALEMATE"
    INSUFFICIENT_MATERIAL = 2, "INSUFFICIENT_MATERIAL"
    FIFTY_MOVES = 3, "FIFTY_MOVES"
    THREEFOLD_REPETITION = 4, "THREEFOLD_REPETITION"
    TIMEOUT = 5, "TIMEOUT"
    RESIGNATION = 6, "RESIGNATION"
    AGREEMENT = 7, "AGREEMENT"

    @staticmethod
    def from_chess_termination(termination: chess.Termination | CustomTermination) -> GameTerminations:
        # Swap the keys and values of TERMINATIONS and get the value of the key
        return {v: k for k, v in TERMINATIONS.items()}[(termination)]


TERMINATIONS = {
    GameTerminations.CHECKMATE: chess.Termination.CHECKMATE,
    GameTerminations.STALEMATE: chess.Termination.STALEMATE,
    GameTerminations.INSUFFICIENT_MATERIAL: chess.Termination.INSUFFICIENT_MATERIAL,
    GameTerminations.FIFTY_MOVES: chess.Termination.FIFTY_MOVES,
    GameTerminations.THREEFOLD_REPETITION: chess.Termination.THREEFOLD_REPETITION,
    GameTerminations.TIMEOUT: CustomTermination.TIMEOUT,
    GameTerminations.RESIGNATION: CustomTermination.RESIGNATION,
    GameTerminations.AGREEMENT: CustomTermination.AGREEMENT,
}

COLORS = {
    True: "white",
    False: "black",
    None: "draw",
}


class Player(models.Model):
    """
    Abstraction class for the Player.
    - Either has to be a regular logged-in user or an anonymous user.
    """

    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    anonymousUser = models.ForeignKey(AnonymousSessionUser, null=True, on_delete=models.CASCADE)

    def clean(self) -> None:
        userObjects = [self.user, self.anonymousUser]
        isValid = sum(item is not None for item in userObjects) == 1

        if not isValid:
            raise ValueError("Exactly one of user or anonymousUser must be set.")

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.clean()
        super().save(*args, **kwargs)


class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    player_white = models.ForeignKey(Player, related_name="player_white", on_delete=models.SET_NULL, null=True)
    player_black = models.ForeignKey(Player, related_name="player_black", on_delete=models.SET_NULL, null=True)
    termination = models.IntegerField(choices=GameTerminations.choices)
    winner_color = models.BooleanField(null=True)
    time_control = models.PositiveBigIntegerField()
    date = models.DateTimeField(auto_now_add=True)

    objects: models.Manager[Game]

    class Meta:
        get_latest_by = ["date"]

    def __str__(self) -> str:
        return str(self.game_id)


class Move(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    move = models.CharField(max_length=5)

    objects: models.Manager[Move]

    class Meta:
        get_latest_by = ("game", "order")
        unique_together = ("game", "order")

    def __str__(self) -> str:
        return f"{self.game} - {self.order} - {self.move}"
