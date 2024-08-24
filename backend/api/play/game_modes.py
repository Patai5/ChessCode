from __future__ import annotations

from typing import List

TimeS = int


class GameMode:
    def __init__(self, name: str, time_controls: List[TimeControl]):
        self.name = name
        self.time_controls = time_controls


class TimeControl:
    def __init__(self, time: TimeS):
        self.time = time

    @property
    def time(self) -> TimeS:
        """Time is defined in seconds"""
        return self._time

    @time.setter
    def time(self, value: TimeS) -> None:
        """Time is defined in seconds"""
        assert not value < 0, "Time cannot be negative"

        self._time = value


ACTIVE_GAME_MODES = [
    GameMode("Bullet", [TimeControl(10), TimeControl(30), TimeControl(60)]),
    GameMode("Blitz", [TimeControl(120), TimeControl(180), TimeControl(300)]),
    GameMode("Rapid", [TimeControl(600), TimeControl(1200), TimeControl(1800)]),
]
"""Currently active game modes"""
