import '../App.css'
import React, { useEffect } from "react";
import { useState } from 'react';

function KnotGrid({ rows, cols, resetSignal }) {
  // State
  const [cells, setCells] = useState(Array.from({ length: rows * cols }, () => 0))
  const [currCell, setCurrCell] = useState(-1)
  const [showSelection, setShowSelection] = useState(false)

  // Update grid if rows or cols change
  useEffect(() => {
    setCells(Array.from({ length: rows * cols }, () => 0))
  }, [rows, cols, resetSignal])

  // Images
  const bgImages = Array.from({ length: 10 }, (_, i) => `/images/T_${i + 1}.PNG`)

  return (
    <div className="grid-wrapper text-black flex flex-col">
      <div className="grid" 
           role="grid" 
           aria-label="5 by 5 grid"
           style={{
            'gridTemplateColumns': `repeat(${cols}, 4rem)`,
            'gridTemplateRows': `repeat(${rows}, 4rem)`
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
          
          return (
            <div 
              key={i} 
              className="cell" 
              role="gridcell"
              style={bgStyle}
              onClick={() => {
                setCurrCell(i);
                setShowSelection(true);
              }}
          /> 
          )
        })}
      </div>
      {showSelection && 
        <div onClick={() => {setShowSelection(false)}} className='mt-4'>
          <p>Select a tile:</p>
          <div className="grid p-4 border rounded-lg bg-gray-200" 
               role="grid"
               style={{
                 'gridTemplateColumns': `repeat(5, 4rem)`,
                 'gridTemplateRows': `repeat(3, 4rem)`
              }}
            >
              {Array.from({ length: 11 }).map((_, i) => {
                const bgStyle = i === 10
                  ? {
                    gridColumn: "3",
                    gridRow: "3",
                  }
                  : {
                    backgroundImage: `url(${bgImages[i]})`,
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
                      newCells[currCell] = i + 1;
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
    </div>
  )
}

export default KnotGrid
