from __future__ import annotations

from typing import Any, cast

import chess
from django.db import models
from django.db.models import QuerySet
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

    user: User | None = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    anonymousUser: AnonymousSessionUser | None = models.ForeignKey(
        AnonymousSessionUser, null=True, on_delete=models.CASCADE
    )

    objects: models.Manager[Player]

    def clean(self) -> None:
        userObjects = [self.user, self.anonymousUser]
        isValid = sum(item is not None for item in userObjects) == 1

        if not isValid:
            raise ValueError("Exactly one of user or anonymousUser must be set.")

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.clean()
        super().save(*args, **kwargs)

    @staticmethod
    def getOrCreatePlayerByUser(user: User | AnonymousSessionUser) -> Player:
        player = Player.getPlayerByUser(user)
        if player:
            return player

        return Player.createAndSaveNewPlayer(user)

    @staticmethod
    def getPlayerByUser(user: User | AnonymousSessionUser) -> Player | None:
        if isinstance(user, User):
            return Player.objects.filter(user=user).first()
        return Player.objects.filter(anonymousUser=user).first()

    @staticmethod
    def createAndSaveNewPlayer(user: User | AnonymousSessionUser) -> Player:
        player = Player(
            user=user if isinstance(user, User) else None,
            anonymousUser=user if isinstance(user, AnonymousSessionUser) else None,
        )
        player.save()

        return player


class Game(models.Model):
    game_id = cast(int, models.AutoField(primary_key=True))
    player_white: Player | None = models.ForeignKey(
        Player, related_name="player_white", on_delete=models.SET_NULL, null=True
    )
    player_black: Player | None = models.ForeignKey(
        Player, related_name="player_black", on_delete=models.SET_NULL, null=True
    )
    termination = cast(int, models.IntegerField(choices=GameTerminations.choices))
    winner_color = cast(bool, models.BooleanField(null=True))
    time_control = cast(int, models.PositiveBigIntegerField())
    date = models.DateTimeField(auto_now_add=True)

    objects: models.Manager[Game]

    class Meta:
        get_latest_by = ["date"]

    def __str__(self) -> str:
        return str(self.game_id)

    @staticmethod
    def getGamesByPlayer(player: Player) -> QuerySet[Game, Game]:
        return Game.objects.filter(models.Q(player_white=player) | models.Q(player_black=player))


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
