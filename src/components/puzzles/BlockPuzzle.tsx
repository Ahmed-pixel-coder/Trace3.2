import React, { useState, useEffect } from 'react';
import { RotateCw, RefreshCw } from 'lucide-react';

interface BlockPuzzleProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const TARGET_PATTERN = [
  [1, 1, 0, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 0, 1, 1],
];

const INITIAL_PATTERN = [
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1],
];

const BlockPuzzle: React.FC<BlockPuzzleProps> = ({ onComplete, isCompleted }) => {
  const [grid, setGrid] = useState(INITIAL_PATTERN.map(row => [...row]));
  const [solved, setSolved] = useState(isCompleted);

  const checkSolution = (currentGrid: number[][]) => {
    return currentGrid.every((row, i) =>
      row.every((cell, j) => cell === TARGET_PATTERN[i][j])
    );
  };

  const toggleBlock = (row: number, col: number) => {
    if (solved) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = 1 - newGrid[row][col];
    
    // Also toggle adjacent blocks
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
        newGrid[newRow][newCol] = 1 - newGrid[newRow][newCol];
      }
    });

    setGrid(newGrid);

    if (checkSolution(newGrid)) {
      setSolved(true);
      setTimeout(onComplete, 500);
    }
  };

  const resetPuzzle = () => {
    setGrid(INITIAL_PATTERN.map(row => [...row]));
    setSolved(false);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-green-400 mb-2">BLOCK PATTERN PUZZLE</h3>
        <p className="text-gray-400 text-sm">Click blocks to toggle them and adjacent blocks. Match the target pattern.</p>
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <div>
          <h4 className="text-sm text-gray-400 mb-2">TARGET</h4>
          <div className="grid grid-cols-4 gap-1 bg-black p-3 rounded border border-gray-600">
            {TARGET_PATTERN.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`target-${i}-${j}`}
                  className={`w-8 h-8 rounded ${
                    cell ? 'bg-green-400' : 'bg-gray-700'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm text-gray-400 mb-2">CURRENT</h4>
          <div className="grid grid-cols-4 gap-1 bg-black p-3 rounded border border-gray-600">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`current-${i}-${j}`}
                  onClick={() => toggleBlock(i, j)}
                  className={`w-8 h-8 rounded transition-all hover:opacity-80 ${
                    cell ? 'bg-blue-400' : 'bg-gray-700'
                  }`}
                  disabled={solved}
                />
              ))
            )}
          </div>
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
          PATTERN MATCHED! Proceeding to coordinates...
        </div>
      )}
    </div>
  );
};

export default BlockPuzzle;