import '../App.css'
import React, { useEffect } from "react";
import { useState } from 'react';

function KnotGrid({ rows, cols, resetSignal, assembleSignal }) {
  // State
  const [cells, setCells] = useState(Array.from({ length: rows * cols }, () => 0))
  const [currCell, setCurrCell] = useState(-1)
  const [showSelection, setShowSelection] = useState(false)
  

  // Update grid if rows or cols change

  // TODO: create way to keep knot in the grid when resizing
  useEffect(() => {
    setCells(Array.from({ length: rows * cols }, () => 0))
  }, [rows, cols])

  // Reset if resetSignal is updated
  useEffect(() => {
    setCells(Array.from({ length: rows * cols }, () => 0))
    setShowSelection(false)
    setCurrCell(-1)
  }, [resetSignal])

  // Hide selection if assembleSignal is updated
  useEffect(() => {
    setShowSelection(false)
    setCurrCell(-1)
  }, [assembleSignal])

  // Images
  const bgImages = Array.from({ length: 10 }, (_, i) => `/images/T_${i + 1}.PNG`)
  const gap = assembleSignal === 0 ? "0.5rem" : "0rem";


  return (
    <div className="grid-wrapper text-black flex flex-col mb-4">
      <div className="grid" 
           role="grid" 
           aria-label="5 by 5 grid"
           style={{
            'gridTemplateColumns': `repeat(${cols}, 4rem)`,
            'gridTemplateRows': `repeat(${rows}, 4rem)`,
            'gap': `${gap}`,
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
                setShowSelection(!showSelection && (assembleSignal === 0));
              }}
              onDoubleClick={() => {
                setCurrCell(i);

                // Update cells
                if (assembleSignal === 0) {
                  const newCells = [...cells];
                  newCells[currCell] = 0;
                  setCells(newCells);
                }
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
        {!showSelection && 
        <div className='h-[266px]'></div>}
    </div>
  )
}

export default KnotGrid
