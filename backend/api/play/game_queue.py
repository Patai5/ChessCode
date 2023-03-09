from typing import Dict
from .game_modes import TimeControl, GameMode, ACTIVE_GAME_MODES
from django.contrib.auth import get_user_model

User = get_user_model()


class GameQueue:
    def __init__(self, game_mode: GameMode, time_control: TimeControl):
        self.game_mode = game_mode
        self.time_control = time_control
        self.queue = []

    @property
    def game_mode(self) -> GameMode:
        return self._game_mode

    @game_mode.setter
    def game_mode(self, value: GameMode):
        assert isinstance(value, GameMode), "Game mode must be a GameMode object"

        self._game_mode = value

    @property
    def time_control(self) -> TimeControl:
        return self._time_control

    @time_control.setter
    def time_control(self, value: TimeControl):
        assert isinstance(value, TimeControl), "Time control must be a TimeControl object"

        self._time_control = value

    @property
    def queue(self) -> list[User]:
        return self._queue

    @queue.setter
    def queue(self, value: list[User]):
        assert isinstance(value, list), "Queue must be a list"
        assert all(isinstance(item, User) for item in value), "Queue must be a list of Users"

        self._queue = value

    def add_user(self, user: User):
        """Add a user to the queue. If there is a match, start a game"""
        assert isinstance(user, User), "User must be a User object"
        assert user not in self.queue, "User is already in queue"

        self.queue.append(user)
        # TODO: Add logic to match users together

    def remove_user(self, user: User):
        """Remove a user from the queue"""
        assert isinstance(user, User), "User must be a User object"
        assert user in self.queue, "User is not in queue"

        self.queue.remove(user)

    def is_player_queuing(self, user: User) -> bool:
        """Returns True if the user is in the queue, False otherwise"""
        assert isinstance(user, User), "User must be a User object"

        return user in self.queue


class QueuingPlayer:
    def __init__(self, user: User, game_queue: GameQueue):
        self.user = user
        self.game_queue = game_queue

    @property
    def user(self) -> User:
        return self._user

    @user.setter
    def user(self, value: User):
        assert isinstance(value, User), "User must be a User object"

        self._user = value

    @property
    def game_queue(self) -> GameQueue:
        return self._game_queue

    @game_queue.setter
    def game_queue(self, value: GameQueue):
        assert isinstance(value, GameQueue), "Game queue must be a GameQueue object"

        self._game_queue = value


class GameQueueManager:
    def __init__(self, game_queues: list[GameQueue]):
        self.game_queues = game_queues
        self.queuing_players = {}

    @property
    def game_queues(self) -> list[GameQueue]:
        return self._game_queues

    @game_queues.setter
    def game_queues(self, value: list[GameQueue]):
        assert isinstance(value, list), "Game queues must be a list"
        assert all(isinstance(item, GameQueue) for item in value), "Game queues must be a list of GameQueue objects"

        self._game_queues = value

    @property
    def queuing_players(self) -> Dict[User, QueuingPlayer]:
        return self._queuing_players

    @queuing_players.setter
    def queuing_players(self, value: Dict[User, QueuingPlayer]):
        self._queuing_players = value

    def add_user(self, user: User, game_queue: GameQueue):
        """Adds a user to a game queue"""
        assert isinstance(user, User), "User must be a User object"
        assert isinstance(game_queue, GameQueue), "Game queue must be a GameQueue object"

        if self.is_player_queuing(user):
            raise ValueError("User is already in a queue")

        self.queuing_players[user] = QueuingPlayer(user, game_queue)
        game_queue.add_user(user)

    def remove_user(self, user: User):
        """Remove a user from a game queue"""
        assert isinstance(user, User), "User must be a User object"

        if not self.is_player_queuing(user):
            raise ValueError("User is not in a queue")

        self.queuing_players[user].game_queue.remove_user(user)
        del self.queuing_players[user]

    def is_player_queuing(self, user: User) -> bool:
        """Returns True if the user is in any queue, False otherwise"""
        assert isinstance(user, User), "User must be a User object"

        return user in self.queuing_players

    def get_game_queue(self, game_mode: str, time_control: int) -> GameQueue | None:
        """
        Gets a game queue by `game_mode` (`str`) and `time_control` (`int`) \n
        Returns None if the game queue does not exist
        """
        assert isinstance(game_mode, str), "Game mode must be a string"
        assert isinstance(time_control, int), "Time control must be an integer"

        for game_queue in self.game_queues:
            if game_queue.game_mode.name.lower() == game_mode.lower() and game_queue.time_control.time == time_control:
                return game_queue

        # Game queue does not exist
        return None


DEFAULT_GAME_QUEUES = [
    GameQueue(game_mode, time_control) for game_mode in ACTIVE_GAME_MODES for time_control in game_mode.time_controls
]
"""Default game queues for all active game modes"""

DEFAULT_GAME_QUEUE_MANAGER = GameQueueManager(DEFAULT_GAME_QUEUES)
"""Default game queue manager for all active game modes"""
