import enum
import random
import threading
from typing import Dict

import chess

from ..utils import genUniqueID
from .chess_board import CHESS_COLOR_NAMES, ChessBoard, CustomOutcome, CustomTermination
from .game_modes import GameMode, TimeControl
from .models import Game as GameModel
from .models import GameTerminations, Move, Player
from .players import APICallbackType, GamePlayer, Players, TimeS, UnknownPlayer, UnknownPlayerType


class GameStatus(enum.Enum):
    NOT_STARTED = enum.auto()
    IN_PROGRESS = enum.auto()
    FINISHED = enum.auto()


class Game:
    def __init__(
        self,
        players: Players,
        game_mode: GameMode,
        time_control: TimeControl,
        game_id: str,
        is_link_game: bool,
    ):
        self.players = players
        self.game_mode = game_mode
        self.time_control = time_control
        self.game_id = game_id
        self.is_link_game = is_link_game

        self.board = ChessBoard()
        self.status = GameStatus.NOT_STARTED
        self.start_reset_abort_timer()

    @property
    def game_id(self) -> str:
        return self._game_id

    @game_id.setter
    def game_id(self, value: str) -> None:
        assert len(value) == 8, "Game ID must be 8 characters long"

        self._game_id = value

    def can_player_join(self, player: Player) -> bool:
        """Checks if the player can join the game."""
        if player in self.players.players:
            return True

        hasUnknownPlayer = any(player is UnknownPlayer for player in self.players.players)
        return hasUnknownPlayer

    def join_player(self, player: Player, api_callback: APICallbackType) -> None:
        """Joins the player into the game."""
        self.players.join_game(player, api_callback)

        if self.status == GameStatus.NOT_STARTED:
            if all(player.joined for player in self.players.gamePlayers):
                self.start()

    def start(self) -> None:
        """Starts the game."""
        self.status = GameStatus.IN_PROGRESS
        self.update_player_timers()
        self.start_reset_abort_timer()

        for player in self.players.gamePlayers:
            player.api_callback("game_started", {"game_started": True})

    def callback_game_result(self, result: chess.Outcome) -> None:
        """Calls the API callbacks with the game result."""

        winningColor = CHESS_COLOR_NAMES[result.winner] if not result.winner is None else "draw"
        for player in self.players.gamePlayers:
            player.api_callback("game_result", [result.termination.name.lower(), winningColor])

    def callback_move(self, player: Player, move: chess.Move | str) -> None:
        """Calls the API callbacks with the move."""

        if isinstance(move, chess.Move):
            move = move.uci()

        for gamePlayer in self.players.gamePlayers:
            if gamePlayer.player != player:
                gamePlayer.api_callback("move", move)

    def start_abort_timer(self, abortAfterTime: TimeS) -> None:
        """Start the abort timer that aborts the game."""
        self.abortTimer = threading.Timer(
            abortAfterTime,
            lambda: self.finish(CustomOutcome(CustomTermination.ABORTED, None)),
        )
        self.abortTimer.start()

    def start_reset_abort_timer(self) -> None:
        """Starts and resets the abort timer. Aborts for the first two moves of the game if the moves were not player in time."""
        abortNotJoined: TimeS = 10
        abortNotJoinedLinkGame: TimeS = 300
        abortFirstMove: TimeS = 30
        abortSecondMove: TimeS = 60

        if self.status == GameStatus.NOT_STARTED:
            if self.is_link_game:
                self.start_abort_timer(abortNotJoinedLinkGame)
            else:
                self.start_abort_timer(abortNotJoined)
            return

        totalMoves = len(self.board.moves)
        if totalMoves > 3:
            return

        self.abortTimer.cancel()
        if totalMoves == 0:
            self.start_abort_timer(abortFirstMove)
        elif totalMoves == 1:
            self.start_abort_timer(abortSecondMove)

    def get_moves_list(self) -> list[str]:
        """Returns a list of all moves made in the game in UCI notation."""
        return [move.uci() for move in self.board.moves]

    def move(self, player: Player, move: chess.Move | str) -> ChessBoard.ILLEGAL_MOVE_TYPE | chess.Outcome | None:
        """
        Moves a piece on the board.

        Parameters:
            - move: The move to make. Can be a chess.Move object or a string in UCI notation.

        Returns:
            - ILLEGAL_MOVE: If the move is illegal.
            - chess.Outcome: If the game is over.
            - None: If the move is legal and the game is not over.
        """
        result = self.board.move(move)
        if result == ChessBoard.ILLEGAL_MOVE or self.status != GameStatus.IN_PROGRESS:
            return ChessBoard.ILLEGAL_MOVE

        self.start_reset_abort_timer()

        self.update_player_timers()
        self.players.remove_draw_offers()

        self.callback_move(player, move)
        if isinstance(result, CustomOutcome):
            self.finish(result)
        return result

    def ran_out_of_time(self) -> None:
        """Handles the case when a player runs out of time."""
        gameOutcome = CustomOutcome(CustomTermination.TIMEOUT, not self.board.color_to_move)
        self.finish(gameOutcome)

    def update_player_timers(self) -> None:
        """Updates the player timers."""
        for player in self.players.gamePlayers:
            if player.color == self.board.color_to_move:
                player.start_timer(self.ran_out_of_time)
            else:
                player.stop_timer()

    def offer_draw(self, player: Player) -> None:
        """Offers a draw to the opponent. If the opponent accepts, the game ends in a draw."""
        offeringPlayer = self.players.by_player(player)
        if offeringPlayer.offers_draw:
            return  # The player has already offered a draw, do nothing
        offeringPlayer.offers_draw = True

        if self.players.is_draw_agreement:
            self.finish(CustomOutcome(CustomTermination.AGREEMENT, None))
        else:
            opponent = self.players.get_opponent(player)
            opponent.api_callback("offer_draw")

    def is_players_turn(self, player: Player) -> bool:
        """Checks if it is the player's turn."""
        return self.board.color_to_move == self.players.by_player(player).color

    def save_to_db(self, result: CustomOutcome) -> None:
        """Saves the game to the database."""
        whitePlayer = self.players.by_color(chess.WHITE).player
        blackPlayer = self.players.by_color(chess.BLACK).player

        game = GameModel(
            player_white=whitePlayer,
            player_black=blackPlayer,
            termination=GameTerminations.from_chess_termination(result.termination),
            winner_color=result.winner,
            time_control=self.time_control.time,
        )
        game.save()
        Move.objects.bulk_create(
            [Move(game=game, order=order, move=move) for order, move in enumerate(self.get_moves_list())]
        )

    def finish(self, result: CustomOutcome) -> None:
        """Finishes the game and saves it to the database.
        - Does not save games with termination of `ABORTED`."""
        self.status = GameStatus.FINISHED
        for player in self.players.gamePlayers:
            player.stop_timer()

        self.callback_game_result(result)

        if result.termination != CustomTermination.ABORTED:
            self.save_to_db(result)

        ALL_ACTIVE_GAMES_MANAGER.remove_game(self.game_id)


class GameManager:
    def __init__(self) -> None:
        self.games: Dict[str, Game] = {}

    def get_game(self, game_id: str) -> Game | None:
        assert len(game_id) == 8, "Game ID must be 8 characters long"

        return self.games.get(game_id)

    def remove_game(self, game_id: str) -> None:
        assert len(game_id) == 8, "Game ID must be 8 characters long"

        if self.get_game(game_id) is not None:
            del self.games[game_id]

    def start_game(
        self,
        players: tuple[Player, Player | UnknownPlayerType],
        game_mode: GameMode,
        time_control: TimeControl,
        link_game: bool = False,
    ) -> Game:
        game_id = genUniqueID(self.games)

        colors = [chess.WHITE, chess.BLACK]
        random.shuffle(colors)

        gamePlayers = Players([GamePlayer(player, color, time_control.time) for player, color in zip(players, colors)])

        game = Game(gamePlayers, game_mode, time_control, game_id, link_game)
        self.games[game_id] = game
        return game


ALL_ACTIVE_GAMES_MANAGER = GameManager()
"""Manages all currently active games in the system"""
