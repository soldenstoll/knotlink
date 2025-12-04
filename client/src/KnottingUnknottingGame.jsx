import React, { use, useEffect, useState } from "react";
import KnotInput from "./components/KnotInput";
import GameGrid from "./components/GameGrid";

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
    const [gameBegan, setGameBegan] = useState(false)

    const wrappedSetter = (_board, _rows, _cols) => {
        setBoard(_board)
        setRows(_rows)
        setCols(_cols)
        setLoadBoard(false)
    }

    const setMoves = (event) => {
        setFirstMove(event.target.value)
        setCurrMove(event.target.value)
    }

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
    )
}

export default KnottingUnknottingGame
