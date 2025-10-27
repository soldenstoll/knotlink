"""
Flask API server for the Knotting/Unknotting game.
Provides REST endpoints for game management.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from game_state import GameState, Player, create_game
from typing import Dict
import uuid

app = Flask(__name__)
CORS(app)

active_games: Dict[str, GameState] = {}


@app.route('/api/game/new', methods=['POST'])
def new_game():
    """
    Create a new game instance.

    Expected JSON body:
    {
        "board": [[0, 0, -1, ...], ...],
        "starting_player": "knotter" or "unknotter"
    }
    """
    try:
        data = request.get_json(force=True, silent=False)
        board = data.get('board')
        starting_player = data.get('starting_player', 'knotter')

        if board is None:
            return jsonify({"error": "Board configuration required"}), 400

        game = create_game(board, starting_player)
        game_id = str(uuid.uuid4())
        active_games[game_id] = game

        return jsonify({
            "game_id": game_id,
            "status": game.get_game_status()
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/game/<game_id>/status', methods=['GET'])
def get_game_status(game_id: str):
    """Get current game status."""
    game = active_games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404
    return jsonify(game.get_game_status()), 200


@app.route('/api/game/<game_id>/move', methods=['POST'])
def make_move(game_id: str):
    """
    Make a move in the game.

    Expected JSON body:
    {
        "row": 0,
        "col": 2,
        "new_tile": 9 or 10
    }
    """
    game = active_games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    try:
        data = request.get_json(force=True, silent=False)
        row = data.get('row')
        col = data.get('col')
        new_tile = data.get('new_tile')

        if row is None or col is None or new_tile is None:
            return jsonify({"error": "row, col, and new_tile are required"}), 400

        success, message = game.make_move(int(row), int(col), int(new_tile))
        response = {
            "success": success,
            "message": message,
            "status": game.get_game_status()
        }
        return jsonify(response), (200 if success else 400)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/game/<game_id>/validate', methods=['POST'])
def validate_move(game_id: str):
    """
    Validate a move without executing it.

    Expected JSON body:
    {
        "row": 0,
        "col": 2,
        "new_tile": 9 or 10
    }
    """
    game = active_games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    try:
        data = request.get_json(force=True, silent=False)
        row = data.get('row')
        col = data.get('col')
        new_tile = data.get('new_tile')

        if row is None or col is None or new_tile is None:
            return jsonify({"error": "row, col, and new_tile are required"}), 400

        is_valid, message = game.is_valid_move(int(row), int(col), int(new_tile))
        return jsonify({"valid": is_valid, "message": message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/game/<game_id>/reset', methods=['POST'])
def reset_game(game_id: str):
    """
    Reset the game to initial state.

    Optional JSON body:
    {
        "board": [[...]] (optional),
        "starting_player": "knotter" or "unknotter" (optional)
    }
    """
    game = active_games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    try:
        data = request.get_json(force=True, silent=False) or {}
        board = data.get('board')
        starting_player_str = data.get('starting_player')

        starting_player = None
        if starting_player_str:
            s = starting_player_str.strip().lower()
            if s not in ("knotter", "unknotter"):
                return jsonify({"error": "starting_player must be 'knotter' or 'unknotter'"}), 400
            starting_player = Player.KNOTTER if s == 'knotter' else Player.UNKNOTTER

        game.reset_game(board, starting_player)

        return jsonify({
            "message": "Game reset successfully",
            "status": game.get_game_status()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/game/<game_id>', methods=['DELETE'])
def delete_game(game_id: str):
    """Delete a game instance."""
    if game_id in active_games:
        del active_games[game_id]
        return jsonify({"message": "Game deleted"}), 200
    return jsonify({"error": "Game not found"}), 404


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "active_games": len(active_games)}), 200


if __name__ == '__main__':
    # Run: python server.py
    app.run(debug=True, host='0.0.0.0', port=5000)