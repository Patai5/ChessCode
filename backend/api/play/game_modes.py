from __future__ import annotations

from typing import List

TimeS = int


class GameMode:
    def __init__(self, name: str, time_controls: List[TimeControl]):
        self.name = name
        self.time_controls = time_controls

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value: str):
        assert isinstance(value, str), "Name must be a string"
        assert value.isalpha(), "Name must contain only letters"

        self._name = value

    @property
    def time_controls(self) -> List[TimeControl]:
        return self._time_controls

    @time_controls.setter
    def time_controls(self, value: List[TimeControl]):
        assert isinstance(value, list), "Time controls must be a list"
        assert all(
            isinstance(item, TimeControl) for item in value
        ), "Time controls must be a list of TimeControl objects"

        self._time_controls = value


class TimeControl:
    def __init__(self, time: TimeS):
        self.time = time

    @property
    def time(self) -> TimeS:
        """Time is defined in seconds"""
        return self._time

    @time.setter
    def time(self, value: TimeS):
        """Time is defined in seconds"""
        assert isinstance(value, TimeS), "Time must be an integer"
        assert not value < 0, "Time cannot be negative"

        self._time = value


ACTIVE_GAME_MODES = [
    GameMode("Bullet", [TimeControl(10), TimeControl(30), TimeControl(60)]),
    GameMode("Blitz", [TimeControl(120), TimeControl(180), TimeControl(300)]),
    GameMode("Rapid", [TimeControl(600), TimeControl(1200), TimeControl(1800)]),
]
"""Currently active game modes"""
