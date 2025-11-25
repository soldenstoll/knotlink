"""
Game state management for the Knotting/Unknotting game.
Handles game initialization, move validation, and state updates.
"""

from enum import Enum
from typing import List, Tuple, Optional
from dataclasses import dataclass
import copy


class Player(Enum):
    """Enum representing the two players."""
    KNOTTER = "knotter"
    UNKNOTTER = "unknotter"


class TileType(Enum):
    """Enum representing different tile types."""
    EMPTY = 0
    RESOLVED_9 = 9
    RESOLVED_10 = 10
    UNRESOLVED = -1


@dataclass
class GameMove:
    """Represents a move in the game."""
    row: int
    col: int
    new_tile: int
    player: Player


class GameState:
    """
    Manages the state of the Knotting/Unknotting game.
    """
    def __init__(self, initial_board: List[List[int]], starting_player: Player):
        """
        Initialize the game state.

        Args:
            initial_board: 2D matrix representing the knot mosaic
            starting_player: Which player goes first (KNOTTER or UNKNOTTER)
        """
        if not isinstance(initial_board, list) or any(not isinstance(r, list) for r in initial_board):
            raise ValueError("Board must be a 2D list of integers")

        self.board = copy.deepcopy(initial_board)
        self.rows = len(initial_board)
        self.cols = len(initial_board[0]) if self.rows > 0 else 0
        self.current_player = starting_player
        self.move_history: List[GameMove] = []
        self.game_over = False
        self.winner: Optional[Player] = None
        self.is_unknot: Optional[bool] = None

        if not self._validate_board_dimensions():
            raise ValueError("Invalid board: rows must all have the same length")

        if self.rows == 0 or self.cols == 0:
            self.game_over = True

    def _validate_board_dimensions(self) -> bool:
        """Ensure all rows have the same number of columns."""
        if self.rows == 0:
            return True
        expected_cols = self.cols
        return all(len(row) == expected_cols for row in self.board)

    def has_unresolved_crossings(self) -> bool:
        """True if any tile is UNRESOLVED (-1)."""
        return any(tile == TileType.UNRESOLVED.value for row in self.board for tile in row)

    def get_unresolved_positions(self) -> List[Tuple[int, int]]:
        """List of (row, col) positions with unresolved crossings."""
        return [
            (i, j)
            for i in range(self.rows)
            for j in range(self.cols)
            if self.board[i][j] == TileType.UNRESOLVED.value
        ]

    def is_valid_move(self, row: int, col: int, new_tile: int) -> Tuple[bool, str]:
        """
        Validate if a move is legal.

        Args:
            row: Row index of the tile to change
            col: Column index of the tile to change
            new_tile: New tile value (should be 9 or 10)

        Returns:
            Tuple of (is_valid, error_message)
        """
        if self.game_over:
            return False, "Game is already over."

        if not isinstance(row, int) or not isinstance(col, int):
            return False, "Row and col must be integers."

        if row < 0 or row >= self.rows or col < 0 or col >= self.cols:
            return False, f"Position ({row}, {col}) is out of bounds."

        current_tile = self.board[row][col]
        if current_tile != TileType.UNRESOLVED.value:
            return False, f"Position ({row}, {col}) is not an unresolved crossing (expected -1, found {current_tile})."

        if new_tile not in (TileType.RESOLVED_9.value, TileType.RESOLVED_10.value):
            return False, f"New tile must be 9 or 10, got {new_tile}."

        return True, ""

    def make_move(self, row: int, col: int, new_tile: int) -> Tuple[bool, str]:
        """
        Execute a move if it's valid.

        Args:
            row: Row index of the tile to change
            col: Column index of the tile to change
            new_tile: New tile value (9 or 10)

        Returns:
            Tuple of (success, message)
        """
        is_valid, error_msg = self.is_valid_move(row, col, new_tile)
        if not is_valid:
            return False, error_msg

        # apply the move
        self.board[row][col] = new_tile
        self.move_history.append(GameMove(row, col, new_tile, self.current_player))

        # check for end of game
        if not self.has_unresolved_crossings():
            self.game_over = True
            return True, f"Move accepted. Game over — all crossings resolved. Awaiting classification to determine winner."

        # swap players
        self.current_player = Player.UNKNOTTER if self.current_player == Player.KNOTTER else Player.KNOTTER
        return True, f"Move accepted. Next player: {self.current_player.value}"

    def get_board_state(self) -> List[List[int]]:
        """Deep copy of the board."""
        return copy.deepcopy(self.board)

    def get_game_status(self) -> dict:
        """Comprehensive game status."""
        unresolved_positions = self.get_unresolved_positions()
        return {
            "current_player": self.current_player.value,
            "game_over": self.game_over,
            "board": self.get_board_state(),
            "unresolved_count": len(unresolved_positions),
            "unresolved_positions": unresolved_positions,
            "move_count": len(self.move_history),
            "rows": self.rows,
            "cols": self.cols,
            "winner": self.winner.value if self.winner else None,
            "is_unknot": self.is_unknot
        }

    def reset_game(self, initial_board: Optional[List[List[int]]] = None, starting_player: Optional[Player] = None):
        """
        Reset the game to initial state.

        Args:
            initial_board: Optional new board configuration
            starting_player: Optional new starting player
        """
        if initial_board is not None:
            if not isinstance(initial_board, list) or any(not isinstance(r, list) for r in initial_board):
                raise ValueError("Board must be a 2D list of integers")
            self.board = copy.deepcopy(initial_board)
            self.rows = len(initial_board)
            self.cols = len(initial_board[0]) if self.rows > 0 else 0

        if starting_player is not None:
            self.current_player = starting_player

        self.move_history.clear()
        self.game_over = not self.has_unresolved_crossings() or self.rows == 0 or self.cols == 0
        self.winner = None
        self.is_unknot = None


def create_game(board: List[List[int]], starting_player: str) -> GameState:
    """
    Factory function to create a new game instance.

    Args:
        board: Initial board configuration
        starting_player: "knotter" or "unknotter"

    Returns:
        Initialized GameState instance
    """
    sp = (starting_player or "").strip().lower()
    if sp not in ("knotter", "unknotter"):
        raise ValueError("starting_player must be 'knotter' or 'unknotter'")
    player = Player.KNOTTER if sp == "knotter" else Player.UNKNOTTER
    return GameState(board, player)