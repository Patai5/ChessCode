from typing import Callable, Dict, Tuple

from users.models import User

from .game import ALL_ACTIVE_GAMES_MANAGER, Game
from .game_modes import ACTIVE_GAME_MODES, GameMode, TimeControl


class GameQueue:
    def __init__(self, game_mode: GameMode, time_control: TimeControl):
        self.game_mode = game_mode
        self.time_control = time_control
        self.queue: list[User] = []

    def add_user(self, user: User) -> None:
        """Add a user to the queue. If there is a match, start a game"""
        assert not self.is_player_queuing(user), "User is already in queue"

        self.queue.append(user)

    def remove_user(self, user: User) -> None:
        """Remove a user from the queue"""
        assert self.is_player_queuing(user), "User is not in queue"

        self.queue.remove(user)

    def is_player_queuing(self, user: User) -> bool:
        """Returns True if the user is in the queue, False otherwise"""
        return user in self.queue


class QueuingPlayer:
    def __init__(self, user: User, game_queue: GameQueue, game_found_callback: Callable[[Game], None] | None = None):
        self.user = user
        self.game_queue = game_queue

        self.game_found_callback = game_found_callback
        """Callback function to be called when a game is found. The game ID will be passed as an argument
        
        Notifies the users that a game has been found using websockets"""


class GameQueueManager:
    def __init__(self, game_modes: list[GameMode]):
        self.game_queues = [
            GameQueue(game_mode, time_control) for game_mode in game_modes for time_control in game_mode.time_controls
        ]
        self.queuing_players: Dict[User, QueuingPlayer] = {}

    def add_user(self, user: User, game_queue: GameQueue, gameFoundCallback: Callable[[Game], None]) -> None:
        """Adds a user to a game queue"""

        if self.is_player_queuing(user):
            raise ValueError("User is already in a queue")

        self.queuing_players[user] = QueuingPlayer(user, game_queue, gameFoundCallback)
        game_queue.add_user(user)

        # Start a game if there are at least two players in the queue
        if len(game_queue.queue) >= 2:
            self.start_game((game_queue.queue[0], game_queue.queue[1]), game_queue)

    def remove_user(self, user: User) -> None:
        """Remove a user from a game queue"""

        if not self.is_player_queuing(user):
            raise ValueError("User is not in a queue")

        self.queuing_players[user].game_queue.remove_user(user)
        del self.queuing_players[user]

    def is_player_queuing(self, user: User) -> bool:
        """Returns True if the user is in any queue, False otherwise"""

        return user in self.queuing_players

    def get_game_queue(self, game_mode: str, time_control: int) -> GameQueue | None:
        """
        Gets a game queue by `game_mode` (`str`) and `time_control` (`int`) \n
        Returns None if the game queue does not exist
        """

        for game_queue in self.game_queues:
            if game_queue.game_mode.name.lower() == game_mode.lower() and game_queue.time_control.time == time_control:
                return game_queue

        # Game queue does not exist
        return None

    def start_game(self, players: Tuple[User, User], game_queue: GameQueue) -> None:
        """Start a game between two players, removing them from the queue"""
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
    def __init__(self) -> None:
        self.groups: dict[Group, GameQueueManager] = {}
        self.default = GameQueueManager(ACTIVE_GAME_MODES)

    def get_create_queue_manager(self, group: Group | None) -> GameQueueManager:
        """Returns a GameQueueManager for the given group. If the group does not exist, it will be created and returned"""

        if group is None:
            return self.default
        elif group in self.groups:
            return self.groups[group]
        else:
            return self.add_group(group)

    def add_group(self, group: Group) -> GameQueueManager:
        """Adds a group to the group queue manager"""

        group = tuple(sorted(group))

        if group in self.groups:
            raise ValueError("Group already exists")

        gameQueueManager = GameQueueManager(ACTIVE_GAME_MODES)
        self.groups[group] = gameQueueManager
        return gameQueueManager

    def remove_group(self, group: Group) -> None:
        """Removes a group from the group queue manager"""

        if group not in self.groups:
            raise ValueError("Group does not exist")

        del self.groups[group]

    def remove_player(self, user: User) -> None:
        """Removes the player from all queues
        - the algorithm is O(n), which could be improved, but it's not worth it"""

        for group, queue in list(self.groups.items()):
            if user.username in group and queue.is_player_queuing(user):
                queue.remove_user(user)
                if len(queue.queuing_players) == 0:
                    self.remove_group(group)

        if self.default.is_player_queuing(user):
            self.default.remove_user(user)


GROUP_QUEUE_MANAGER = GroupQueueManager()
"""Default group game queue manager for all active game modes"""
