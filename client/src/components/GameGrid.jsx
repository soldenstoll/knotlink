import '../App.css'
import React, { useEffect, useState } from "react";
import GameAPI from '../services/api';
import './GameStyles.css';

function GameGrid({ board, rows, cols, canMove, setter, gameId, pendingMove, setPendingMove }) {
  // State
  const [cells, setCells] = useState(board)
  const [currCell, setCurrCell] = useState(-1)
  const [showSelection, setShowSelection] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCells(board)
  }, [board])

  // Create list of images
  const bgImages = Array.from({ length: 10 }, (_, i) => `/images/T_${i + 1}.PNG`)
  bgImages.push("/images/T_11.jpg")
  const moves = Array.from({ length: 2 }, (_, i) => `/images/T_${9 + i}.PNG`)

  // Handle cell click
  const handleCellClick = (index) => {
    if (!canMove) {
      setError("Game has not started or is over");
      return;
    }

    if (pendingMove !== null) {
      setError("You already have a pending move. Submit it before making another move.");
      return;
    }

    if (cells[index] !== 11) {
      setError("Can only modify unresolved crossings");
      return;
    }

    setCurrCell(index);
    setShowSelection(true);
    setError(null);
  };

  // Handle tile selection and make move
  const handleTileSelect = async (tileValue) => {
    if (!gameId || currCell === -1) return;

    setLoading(true);
    setError(null);

    try {
      // Calculate row and col from flat index
      const row = Math.floor(currCell / cols);
      const col = currCell % cols;

      // Make move via API (tiles 9 and 10 in UI map to 9 and 10 in backend)
      const response = await GameAPI.makeMove(gameId, row, col, tileValue);

      if (response.success) {
        // Update local state with the new board
        const newCells = [...cells];
        newCells[currCell] = tileValue;
        setCells(newCells);
        
        // Convert board back to use 11 for unresolved
        const boardFor2D = newCells.map(tile => tile === -1 ? 11 : tile);
        
        // Update parent component
        setter(boardFor2D, rows, cols);
        
        // Set pending move to indicate a move has been made
        setPendingMove({ row, col, tileValue });
        
        setError(null);
      } else {
        setError(response.message || "Move failed");
      }
    } catch (err) {
      setError(`Failed to make move: ${err.message}`);
    } finally {
      setLoading(false);
      setCurrCell(-1);
      setShowSelection(false);
    }
  };

  // Display grid
  return (
    <div className="grid-wrapper text-black flex flex-col mb-4">
      {/* Error display */}
      {error && (
        <div className="game-alert game-alert-error">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{textAlign: 'center', color: '#2563eb', marginBottom: '8px', fontWeight: '600'}}>
          Processing move...
        </div>
      )}

      {/* Grid */}
      <div className="grid" 
           role="grid" 
           aria-label={`${rows} by ${cols} grid`}
           style={{
            'gridTemplateColumns': `repeat(${cols}, 4rem)`,
            'gridTemplateRows': `repeat(${rows}, 4rem)`,
            'gap': 0,
           }}
      >
        {cells.map((cell, i) => {
          const bgStyle = cells[i] === 0
            ? {}
            : {
              backgroundImage: `url(${bgImages[cells[i] - 1]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            };
          
          // Unresolved crossing (11 maps to -1 in backend)
          if (cells[i] === 11) {
            const isPending = pendingMove !== null;
            return (
              <div 
                key={i} 
                className={`game-playable-cell ${!canMove || isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                role="gridcell"
                style={bgStyle}
                onClick={() => !isPending && handleCellClick(i)}
                title={isPending ? "Submit your current move first" : "Click to resolve this crossing"}
              />
            )
          }
          
          // Other tiles (non-playable)
          return (
            <div 
              key={i} 
              className='game-nonplayable-cell' 
              role="gridcell"
              style={bgStyle}
          /> 
          )
        })}
      </div>

      {/* Tile selection panel */}
      {showSelection && 
        <div style={{marginTop: '16px'}}>
          <p style={{textAlign: 'center', marginBottom: '8px', fontWeight: '600', fontSize: '1.125rem'}}>
            Select a resolution for the crossing:
          </p>
          <div className="tile-selection-panel">
            <div className="tile-selection-grid">
              {Array.from({ length: 2 }).map((_, i) => {
                const bgStyle = {
                    backgroundImage: `url(${moves[i]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  };
                
                return (
                  <div 
                    key={i} 
                    className="cell tile-option" 
                    role="gridcell"
                    style={bgStyle}
                    onClick={() => handleTileSelect(i + 9)}
                    title={i === 0 ? "Tile 9" : "Tile 10"}
                /> 
                )
              })}
            </div>
          </div>
            <button 
              onClick={() => {
                setShowSelection(false);
                setCurrCell(-1);
              }}
              className="game-btn-primary game-btn-gray"
              style={{marginTop: '16px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
            >
              Cancel
            </button>
        </div>
      }
      
      {/* Spacer when selection panel is hidden */}
      {!showSelection && 
        <div className='h-[200px]'></div>
      }
    </div>
  )
}

export default GameGrid;
