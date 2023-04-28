from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class GameTerminations(models.IntegerChoices):
    CHECKMATE = 0, "CHECKMATE"
    STALEMATE = 1, "STALEMATE"
    INSUFFICIENT_MATERIAL = 2, "INSUFFICIENT_MATERIAL"
    FIFTY_MOVES = 3, "FIFTY_MOVES"
    THREEFOLD_REPETITION = 4, "THREEFOLD_REPETITION"
    TIMEOUT = 5, "TIMEOUT"
    RESIGNATION = 6, "RESIGNATION"
    AGREEMENT = 7, "AGREEMENT"


class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    player_white = models.ForeignKey(User, related_name="player_white", on_delete=models.SET_NULL, null=True)
    player_black = models.ForeignKey(User, related_name="player_black", on_delete=models.SET_NULL, null=True)
    termination = models.IntegerField(choices=GameTerminations.choices)
    winner_color = models.BooleanField(null=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        get_latest_by = ["date"]

    def __str__(self):
        return str(self.game_id)


class Move(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    move = models.CharField(max_length=5)

    class Meta:
        get_latest_by = ("game", "order")
        unique_together = ("game", "order")

    def __str__(self):
        return f"{self.game} - {self.order} - {self.move}"
