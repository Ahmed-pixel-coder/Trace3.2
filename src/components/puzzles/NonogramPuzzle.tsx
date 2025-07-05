import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface NonogramPuzzleProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const SOLUTION = [
  [1, 0, 0, 1],
  [1, 1, 1, 1],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
];

const ROW_CLUES = [
  [1, 1],
  [4],
  [2],
  [1, 1],
];

const COL_CLUES = [
  [2, 1],
  [2],
  [2],
  [2, 1],
];

const NonogramPuzzle: React.FC<NonogramPuzzleProps> = ({ onComplete, isCompleted }) => {
  const [grid, setGrid] = useState(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [solved, setSolved] = useState(isCompleted);

  const checkSolution = (currentGrid: number[][]) => {
    return currentGrid.every((row, i) =>
      row.every((cell, j) => cell === SOLUTION[i][j])
    );
  };

  const toggleCell = (row: number, col: number) => {
    if (solved) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
    setGrid(newGrid);

    if (checkSolution(newGrid)) {
      setSolved(true);
      setTimeout(onComplete, 500);
    }
  };

  const resetPuzzle = () => {
    setGrid(Array(4).fill(null).map(() => Array(4).fill(0)));
    setSolved(false);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-green-400 mb-2">NONOGRAM PUZZLE</h3>
        <p className="text-gray-400 text-sm">Fill cells based on number clues. Numbers indicate consecutive filled cells.</p>
      </div>

      <div className="inline-block bg-black p-4 rounded border border-gray-600 mb-6">
        <div className="grid grid-cols-5 gap-1">
          {/* Top-left empty cell */}
          <div className="w-8 h-8"></div>
          
          {/* Column clues */}
          {COL_CLUES.map((clue, i) => (
            <div key={`col-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-green-400">
              {clue.join(' ')}
            </div>
          ))}

          {/* Grid with row clues */}
          {grid.map((row, i) => (
            <React.Fragment key={`row-${i}`}>
              {/* Row clue */}
              <div className="w-8 h-8 flex items-center justify-center text-xs text-green-400">
                {ROW_CLUES[i].join(' ')}
              </div>
              
              {/* Grid cells */}
              {row.map((cell, j) => (
                <button
                  key={`cell-${i}-${j}`}
                  onClick={() => toggleCell(i, j)}
                  className={`w-8 h-8 border border-gray-500 transition-all hover:opacity-80 ${
                    cell === 1 ? 'bg-green-400' : 'bg-gray-800'
                  }`}
                  disabled={solved}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <button
        onClick={resetPuzzle}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 text-gray-300 mb-4"
      >
        <RefreshCw className="w-4 h-4 inline mr-2" />
        Reset
      </button>

      {solved && (
        <div className="text-green-400 font-bold text-lg">
          NONOGRAM SOLVED! Proceeding to coordinates...
        </div>
      )}
    </div>
  );
};

export default NonogramPuzzle;