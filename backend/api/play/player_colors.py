from __future__ import annotations

import random
from typing import Iterable

import chess
from django.contrib.auth import get_user_model

User = get_user_model()

COLOR_NAMES = {
    "white": chess.WHITE,
    "black": chess.BLACK,
}


class PlayerColors:
    def __init__(self, white: User, black: User):
        self.white = white
        self.black = black

    @property
    def players(self) -> list[User]:
        return [self.white, self.black]

    @staticmethod
    def assignRandomColors(players: Iterable[User]) -> PlayerColors:
        """Returns a Players struct with the players assigned with random colors"""
        assert len(players) == 2, "There must be exactly two players"
        assert all(isinstance(player, User) for player in players), "Players must be a iterable of Users"

        return PlayerColors(*random.sample(players, 2))

    def get_user_color(self, user: User) -> chess.Color | None:
        """Gets the color of the user."""
        assert isinstance(user, User), "User must be a User object"

        for color, player in self.to_dict().items():
            if player == user:
                return COLOR_NAMES[color]
        return None

    def to_dict(self) -> dict[str, User]:
        """Converts the Players struct to a dict"""
        return {"white": self.white, "black": self.black}

    def to_json_dict(self) -> dict[str, str]:
        """Converts the Players struct to a JSON serializable dict"""
        return {color: user.username for color, user in self.to_dict().items()}
