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
        setBoard(_board)
        setRows(_rows)
        setCols(_cols)
        setLoadBoard(false)
        console.log(rows)
        console.log(cols)
    }

    return (
        <div className="flex flex-col w-full gap-4 text-black">  
            {!gameBegan && <div id="game-knotinput-wrapper" className="flex flex-col w-[80%] items-center self-center">
                {!loadBoard && <button onClick={() => setLoadBoard(true)}>load game board</button>}
                {loadBoard && <KnotInput setter={wrappedSetter}></KnotInput>}
            </div>}
            <div id="game-start-wrapper" className="w-full flex flex-row gap-4 justify-center">
                {!gameBegan && <button>start game</button>}
            </div>
            <GameGrid rows={rows} cols={cols} board={board}></GameGrid>
        </div>
    )
}

export default KnottingUnknottingGame
