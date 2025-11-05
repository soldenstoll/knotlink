import '../App.css'
import React, { useEffect } from "react";
import { useState } from 'react';
import KnotInput from './KnotInput';

// TODO: Add import and export buttons
function GameGrid({ board, rows, cols }) {
  // State
  const [cells, setCells] = useState(board)
  const [currCell, setCurrCell] = useState(-1)
  const [showSelection, setShowSelection] = useState(false)

  /////////////////////////////////////////////////////////////////////////////

  // Create list of images
  const bgImages = Array.from({ length: 10 }, (_, i) => `/images/T_${i + 1}.PNG`)
  bgImages.push("/images/T_11.jpg")
  const moves = Array.from({ length: 2 }, (_, i) => `/images/T_${9 + i}.PNG`)

  const nonplayableCellOnClick = () => {
    console.log("nah")
  }

  // Display grid
  return (
    <div className="grid-wrapper text-black flex flex-col mb-4">
      <div className="grid" 
           role="grid" 
           aria-label="5 by 5 grid"
           style={{
            'gridTemplateColumns': `repeat(${cols}, 4rem)`,
            'gridTemplateRows': `repeat(${rows}, 4rem)`,
            'gap': 0,
           }}
      >
        {cells.map((_, i) => {
          const bgStyle = cells[i] === 0
            ? {}
            : {
              backgroundImage: `url(${bgImages[cells[i] - 1]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            };
          
          if (cells[i] === 11) {
            return (
              <div 
                key={i} 
                className='game-playable-cell'
                role="gridcell"
                style={bgStyle}
                onClick={() => {
                  setCurrCell(i);
                  setShowSelection(!showSelection);
                }}
              /> 
            )
          }
          
          return (
            <div 
              key={i} 
              className='game-nonplayable-cell' 
              role="gridcell"
              style={bgStyle}
              onClick={() => {
                /* TODO: Add cannot play message */
                console.log("can't do that")
              }}
          /> 
          )
        })}
      </div>
      {showSelection && 
        <div onClick={() => {setShowSelection(false)}} className='mt-4'>
          <p>Select a tile:</p>
          <div className="grid p-4 border rounded-lg bg-gray-200 gap-4" 
               role="grid"
               style={{
                 'gridTemplateColumns': `repeat(2, 4rem)`,
                 'gridTemplateRows': `repeat(1, 4rem)`
              }}
            >
              {Array.from({ length: 2 }).map((_, i) => {
                const bgStyle = {
                    backgroundImage: `url(${moves[i]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  };
                
                return (
                  <div 
                    key={i} 
                    className="cell" 
                    role="gridcell"
                    style={bgStyle}
                    onClick={() => {
                      // Update cells
                      const newCells = [...cells];
                      newCells[currCell] = i + 9;
                      setCells(newCells);

                      // Hide selection pannel
                      setCurrCell(-1);
                      setShowSelection(false);
                    }}
                /> 
                )
              })}
            </div>
        </div>}
        {!showSelection && 
        <div className='h-[266px]'></div>}
    </div>
  )
}

export default GameGrid
