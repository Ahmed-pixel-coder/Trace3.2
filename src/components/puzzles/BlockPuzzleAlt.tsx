import React, { useState } from 'react';

interface BlockPuzzleProps {
  onComplete: () => void;
  isCompleted: boolean;
}

// New block puzzle variation for the other team
const SOLUTION = [
  [0, 1, 1, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 1, 1, 0],
];

const BlockPuzzleAlt: React.FC<BlockPuzzleProps> = ({ onComplete, isCompleted }) => {
  const [grid, setGrid] = useState([
    [0, 0, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
  ]);
  const [solved, setSolved] = useState(isCompleted);

  const toggleCell = (row: number, col: number) => {
    if (solved) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
    setGrid(newGrid);
    if (JSON.stringify(newGrid) === JSON.stringify(SOLUTION)) {
      setSolved(true);
      setTimeout(onComplete, 500);
    }
  };

  const resetPuzzle = () => {
    setGrid([
      [0, 0, 1, 1],
      [1, 0, 0, 1],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
    ]);
    setSolved(false);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-green-400 mb-2">BLOCK PUZZLE (ALT)</h3>
        <p className="text-gray-400 text-sm">Toggle blocks to match the target pattern.</p>
      </div>
      <div className="inline-block bg-black p-4 rounded border border-gray-600 mb-6">
        <div className="grid grid-cols-4 gap-1">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`cell-${i}-${j}`}
                onClick={() => toggleCell(i, j)}
                className={`w-8 h-8 border border-gray-500 transition-all hover:opacity-80 ${
                  cell === 1 ? 'bg-green-400' : 'bg-gray-800'
                }`}
                disabled={solved}
              />
            ))
          )}
        </div>
      </div>
      <button
        onClick={resetPuzzle}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 text-gray-300 mb-4"
      >
        Reset
      </button>
      {solved && (
        <div className="text-green-400 font-bold text-lg">
          BLOCK PUZZLE SOLVED! Proceeding to coordinates...
        </div>
      )}
    </div>
  );
};

export default BlockPuzzleAlt;
