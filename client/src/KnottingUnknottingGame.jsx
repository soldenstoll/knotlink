import React, { useState } from "react";
import KnotInput from "./components/KnotInput";
import GameGrid from "./components/GameGrid";

function KnottingUnknottingGame() {
    // Set default board
    const [rows, setRows] = useState(5)
    const [cols, setCols] = useState(5)
    const [board, setBoard] = useState([0, 2, 5, 5, 1, 2, 11, 5, 1, 6, 6, 6, 2, 11, 4, 6, 3, 11, 4, 0, 3, 5, 4, 0, 0])

    // Board loading state
    const [loadBoard, setLoadBoard] = useState(false)

    // Game state
    const [gameBegan, setGameBegan] = useState(false)

    const wrappedSetter = (_board, _rows, _cols) => {
        setRows(_rows)
        setCols(_cols)
        setBoard(_board)
        setLoadBoard(false)
    }

    return (
        <div className="flex flex-col w-full gap-4">  
            {!gameBegan && <div id="game-knotinput-wrapper" className="flex flex-col w-[80%] items-center self-center">
                {!loadBoard && <button onClick={() => setLoadBoard(true)}>load game board</button>}
                {loadBoard && <KnotInput setter={wrappedSetter}></KnotInput>}
            </div>}
            <GameGrid rows={rows} cols={cols} board={board}></GameGrid>
        </div>
    )
}

export default KnottingUnknottingGame
