import React from 'react';
import './index.css';
import KnotGrid from './components/KnotGrid';
import { useState } from 'react';

function MosaicMaker() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [resetSignal, setResetSignal] = useState(0);  
  const [assembleSignal, setAssembleSignal] = useState(0);

  const buttonName = ["Assemble", "Edit"];


  const options = Array.from({ length: 20 }, (_, i) => i + 1)

  return (
    <div className='text-black'>
      <h1>Mosaic Creator</h1>
      <p>Click on a cell to change its tile. Double click to reset a tile.</p>
      <div className='flex flex-row justify-center p-2'>
        <div>Rows:&nbsp;</div>
        <select 
          id="rows"
          value={rows} 
          onChange={(e) => setRows(Number(e.target.value))}
          className='border rounded'
        >
          {options.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <div>&nbsp;Columns:&nbsp;</div>
        <select 
          id="cols"
          value={cols} 
          onChange={(e) => setCols(Number(e.target.value))}
          className='border rounded'
        >
          {options.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <p>&nbsp;</p>
        <button onClick={() => (
          setResetSignal((resetSignal + 1) % 2)
        )}
        >
          Reset
        </button>
        <p>&nbsp;</p>
        <button onClick={() => (
          setAssembleSignal((assembleSignal + 1) % 2)
        )}
        >
          {buttonName[assembleSignal]}
        </button>
      </div>
      <KnotGrid rows={rows} cols={cols} resetSignal={resetSignal} assembleSignal={assembleSignal} />
    </div>
  )
}

export default MosaicMaker
