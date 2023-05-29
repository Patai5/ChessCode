from typing import Callable, Dict, Tuple

from django.contrib.auth import get_user_model

from .game import ALL_ACTIVE_GAMES_MANAGER, Game
from .game_modes import ACTIVE_GAME_MODES, GameMode, TimeControl

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
    def __init__(self, user: User, game_queue: GameQueue, game_found_callback: Callable[[Game], None] | None = None):
        self.user = user
        self.game_queue = game_queue
        self.game_found_callback = game_found_callback

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

    @property
    def game_found_callback(self) -> Callable[[Game], None] | None:
        """Callback function to be called when a game is found. The game ID will be passed as an argument

        Notifies the users that a game has been found using websockets"""

        return self._game_found_callback

    @game_found_callback.setter
    def game_found_callback(self, value: Callable[[Game], None] | None):
        assert value is None or callable(value), "Game found callback must be a callable function or None"

        self._game_found_callback = value


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

    def add_user(self, user: User, game_queue: GameQueue, gameFoundCallback: Callable[[Game], None] = None):
        """Adds a user to a game queue"""
        assert isinstance(user, User), "User must be a User object"
        assert isinstance(game_queue, GameQueue), "Game queue must be a GameQueue object"

        if self.is_player_queuing(user):
            raise ValueError("User is already in a queue")

        self.queuing_players[user] = QueuingPlayer(user, game_queue, gameFoundCallback)
        game_queue.add_user(user)

        # Start a game if there are at least two players in the queue
        if len(game_queue.queue) >= 2:
            self.start_game((game_queue.queue[0], game_queue.queue[1]), game_queue)

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

    def start_game(self, players: Tuple[User, User], game_queue: GameQueue):
        """Start a game between two players, removing them from the queue"""
        assert isinstance(players, tuple), "Players must be a tuple"
        assert len(players) == 2, "Players must be a tuple of exactly two players"
        assert all(isinstance(item, User) for item in players), "Players must be a tuple of Users"
        assert isinstance(game_queue, GameQueue), "Game queue must be a GameQueue object"

        if all(player not in game_queue.queue for player in players):
            raise ValueError("Players are not in the queue")

        game = ALL_ACTIVE_GAMES_MANAGER.start_game(players, game_queue.game_mode, game_queue.time_control)
        for player in players:
            callback = self.queuing_players[player].game_found_callback
            if callback is not None:
                callback(game)
            self.remove_user(player)


Group = tuple[str, ...]
"""A tuple of usernames present in the group, sorted alphabetically"""


class GroupQueueManager:
    def __init__(self):
        self.groups: dict[Group, GameQueueManager] = {("Patai2", "Patai5"): GameQueueManager(DEFAULT_GAME_QUEUES)}
        self.default = GameQueueManager(DEFAULT_GAME_QUEUES)

    def get_queue_manager(self, group: Group | None) -> GameQueueManager | None:
        """Returns a GameQueueManager for the given group. If the group does not exist, returns None"""
        assert group is None or isinstance(group, tuple), "Group must be a tuple or None"
        assert group is None or (
            all(isinstance(item, str) for item in group)
        ), "Group must be a tuple of strings or None"

        if group is None:
            return self.default
        elif group in self.groups:
            return self.groups[group]
        else:
            return None

    def add_group(self, group: Group):
        """Adds a group to the group queue manager"""
        assert isinstance(group, tuple), "Group must be a tuple"
        assert all(isinstance(item, str) for item in group), "Group must be a tuple of strings"

        group: Group = tuple(sorted(group))

        if group in self.groups:
            raise ValueError("Group already exists")

        self.groups[group] = GameQueueManager(DEFAULT_GAME_QUEUES)

    def remove_group(self, group: Group):
        """Removes a group from the group queue manager"""
        assert isinstance(group, tuple), "Group must be a tuple"
        assert all(isinstance(item, str) for item in group), "Group must be a tuple of strings"

        if group not in self.groups:
            raise ValueError("Group does not exist")

        del self.groups[group]

    def remove_player(self, user: User):
        """Removes the player from all queues
        - the algorithm is O(n), which could be improved, but it's not worth it"""
        assert isinstance(user, User), "User must be a User object"

        for group, queue in list(self.groups.items()) + [((user.username,), self.default)]:
            if user.username in group:
                if queue.is_player_queuing(user):
                    queue.remove_user(user)


DEFAULT_GAME_QUEUES = [
    GameQueue(game_mode, time_control) for game_mode in ACTIVE_GAME_MODES for time_control in game_mode.time_controls
]
"""Default game queues for all active game modes"""

DEFAULT_GROUP_QUEUE_MANAGER = GroupQueueManager()
"""Default group game queue manager for all active game modes"""
