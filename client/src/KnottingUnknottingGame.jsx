import React, { useState, useEffect } from "react";
import KnotInput from "./components/KnotInput";
import GameGrid from "./components/GameGrid";
import GameAPI from "./services/api";
import "./components/GameStyles.css";

function KnottingUnknottingGame() {
    // Set default board
    const [rows, setRows] = useState(5)
    const [cols, setCols] = useState(5)
    const [board, setBoard] = useState([0, 2, 5, 5, 1, 2, 11, 5, 1, 6, 6, 6, 2, 11, 4, 6, 3, 11, 4, 0, 3, 5, 4, 0, 0])
    const [prevBoard, setPrevBoard] = useState([0, 2, 5, 5, 1, 2, 11, 5, 1, 6, 6, 6, 2, 11, 4, 6, 3, 11, 4, 0, 3, 5, 4, 0, 0])
    const [firstMove, setFirstMove] = useState(0)
    const [currMove, setCurrMove] = useState(0)
    const [round, setRound] = useState(0)
    const [remainingTurns, setRemainingTurns] = useState(board.filter(item => item === 11).length)
    const [moved, setMoved] = useState(true)

    // Check how many te
    const startingTurns = remainingTurns;

    // Board loading state
    const [loadBoard, setLoadBoard] = useState(false)

    // Game state
    const [gameId, setGameId] = useState(null);
    const [rows, setRows] = useState(5);
    const [cols, setCols] = useState(5);
    const [board, setBoard] = useState([0, 2, 5, 5, 1, 2, 11, 5, 1, 6, 6, 6, 2, 11, 4, 6, 3, 11, 4, 0, 3, 5, 4, 0, 0]);
    const [firstMove, setFirstMove] = useState(0);
    const [currMove, setCurrMove] = useState(0);
    const [remainingTerms, setRemainingTerms] = useState(board.filter(item => item === 11).length);
    const [pendingMove, setPendingMove] = useState(null); // Track the pending move
    
    // UI state
    const [loadBoard, setLoadBoard] = useState(false);
    const [gameBegan, setGameBegan] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [classification, setClassification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    // Convert flat array to 2D board
    const get2DBoard = () => {
        const board2D = [];
        for (let i = 0; i < rows; i++) {
            board2D.push(board.slice(i * cols, (i + 1) * cols));
        }
        return board2D;
    };

    // Convert 2D board to flat array
    const flattenBoard = (board2D) => {
        return board2D.flat();
    };

    // Wrapper for KnotInput setter
    const wrappedSetter = (_board, _rows, _cols) => {
        setBoard(_board)
        setRows(_rows)
        setCols(_cols)
        setLoadBoard(false)
    }

    // Set first move
    const setMoves = (event) => {
        setFirstMove(Number(event.target.value));
        setCurrMove(Number(event.target.value));
    };

    // Start the game by creating it in backend
    const startGame = async () => {
        setLoading(true);
        setError(null);
        try {
            // Convert 11s to -1s for backend
            const backendBoard = board.map(tile => tile === 11 ? -1 : tile);
            const board2D = [];
            for (let i = 0; i < rows; i++) {
                board2D.push(backendBoard.slice(i * cols, (i + 1) * cols));
            }
            
            const startingPlayer = firstMove === 0 ? "unknotter" : "knotter";
            const response = await GameAPI.createGame(board2D, startingPlayer);
            
            setGameId(response.game_id);
            setGameBegan(true);
            setMessage("Game started!");
        } catch (err) {
            setError(`Failed to start game: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const doOnSubmitClick = () => {
        if (moved) {
            setPrevBoard([...board])
            setRound(round + 1)
            setCurrMove((currMove + 1) % 2)
        } else {
            // TODO
        }
    }

    const doOnUndoClick = () => {
        setBoard([...prevBoard]);
        setMoved(false)
    }

    // Reset game
    const resetGame = async () => {
        if (gameId) {
            try {
                await GameAPI.deleteGame(gameId);
            } catch (err) {
                console.error("Failed to delete game:", err);
            }
        }
        
        setGameId(null);
        setGameBegan(false);
        setGameOver(false);
        setWinner(null);
        setClassification(null);
        setError(null);
        setMessage("");
        setPendingMove(null);
        setBoard([0, 2, 5, 5, 1, 2, 11, 5, 1, 6, 6, 6, 2, 11, 4, 6, 3, 11, 4, 0, 3, 5, 4, 0, 0]);
        setRemainingTerms(3);
    };

    // Update remaining terms when board changes
    useEffect(() => {
        setRemainingTurns(board.filter(item => item === 11).length)
    }, [board])

    return (
        <div className="flex flex-col w-full gap-4 text-black">  
            {!gameBegan && <div id="game-knotinput-wrapper" className="flex flex-col w-[80%] items-center self-center">
                {!loadBoard && <button onClick={() => setLoadBoard(true)}>load game board</button>}
                {loadBoard && <KnotInput setter={wrappedSetter}></KnotInput>}
            </div>}
            {!gameBegan && <div id="game-start-wrapper" className="w-full flex flex-row gap-4 justify-center">
                <button onClick={() => setGameBegan(true)}>start game</button>
                <p>First move:</p>
                <select className="border-1 border-black rounded-sm" 
                    onChange={setMoves}
                    defaultValue={0}
                >
                    <option value={0}>Unknotter</option>
                    <option value={1}>Knotter</option>
                </select>
            </div>}
            {gameBegan && <div id="game-progress-wrapper" className="w-full flex flex-col gap-4 justify-center">
                <div id="game-state-wrapper" className="w-full flex flex-row gap-4 justify-center">
                    <p>Current move: {currMove === 0 ? "Unknotter" : "Knotter"}</p>
                    <p>Remaining turns: {remainingTurns}</p>
                    <p>First move: {firstMove === 0 ? "Unknotter" : "Knotter"}</p>
                    <button onClick={doOnSubmitClick}>Submit move</button>
                    <button onClick={doOnUndoClick}>Undo move</button>
                </div>
                <p>Select a highligted cell below to resolve its crossing, and submit when done</p>
            </div>}
            <GameGrid rows={rows} cols={cols} board={[...board]} started={gameBegan} setter={wrappedSetter}></GameGrid>
        </div>
    );
}

export default KnottingUnknottingGame;