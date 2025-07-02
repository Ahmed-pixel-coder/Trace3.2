import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MazePuzzleProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,1,0,0,1,0,1,0,1,1,1,0,0,1],
  [1,1,0,1,0,1,1,0,1,0,0,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,1],
  [1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,1,0,1,0,1],
  [1,0,1,0,1,0,0,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,1,0,0,3,1], // Blocked (14,14) to create a dead end, opened (13,14)
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const MazePuzzle: React.FC<MazePuzzleProps> = ({ onComplete, isCompleted }) => {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [solved, setSolved] = useState(isCompleted);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (solved) return;
      
      let newX = playerPos.x;
      let newY = playerPos.y;

      switch (e.key) {
        case 'ArrowUp':
          newY = Math.max(0, playerPos.y - 1);
          break;
        case 'ArrowDown':
          newY = Math.min(MAZE.length - 1, playerPos.y + 1);
          break;
        case 'ArrowLeft':
          newX = Math.max(0, playerPos.x - 1);
          break;
        case 'ArrowRight':
          newX = Math.min(MAZE[0].length - 1, playerPos.x + 1);
          break;
        default:
          return;
      }

      if (MAZE[newY][newX] !== 1) {
        setPlayerPos({ x: newX, y: newY });
        
        if (MAZE[newY][newX] === 3) {
          setSolved(true);
          setTimeout(onComplete, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, solved, onComplete]);

  const handleDirectionClick = (direction: string) => {
    if (solved) return;
    
    const event = new KeyboardEvent('keydown', { key: `Arrow${direction}` });
    window.dispatchEvent(event);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-green-400 mb-2">NAVIGATION MAZE</h3>
        <p className="text-gray-400 text-sm">Navigate to the exit (red square)</p>
      </div>

      <div className="inline-block bg-black p-4 rounded border border-gray-600 mb-6">
        <div
          className="grid gap-0.5"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(16, 1fr)',
            gridTemplateRows: 'repeat(16, 1fr)',
            aspectRatio: '1 / 1',
            width: 'min(90vw, 32rem)',
            height: 'auto'
          }}
        >
          {MAZE.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              let cellClass = 'w-4 h-4 ';
              
              if (cell === 1) cellClass += 'bg-gray-600'; // Wall
              else if (cell === 2) cellClass += 'bg-green-400'; // Start
              else if (cell === 3) cellClass += 'bg-red-400'; // End
              else cellClass += 'bg-gray-800'; // Path

              if (isPlayer) cellClass += ' ring-2 ring-yellow-400';

              return (
                <div
                  key={`${x}-${y}`}
                  className={cellClass}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto mb-4">
        <div></div>
        <button
          onClick={() => handleDirectionClick('Up')}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-500"
        >
          <ArrowUp className="w-5 h-5 mx-auto" />
        </button>
        <div></div>
        <button
          onClick={() => handleDirectionClick('Left')}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-500"
        >
          <ArrowLeft className="w-5 h-5 mx-auto" />
        </button>
        <button
          onClick={() => handleDirectionClick('Down')}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-500"
        >
          <ArrowDown className="w-5 h-5 mx-auto" />
        </button>
        <button
          onClick={() => handleDirectionClick('Right')}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-500"
        >
          <ArrowRight className="w-5 h-5 mx-auto" />
        </button>
      </div>

      {solved && (
        <div className="text-green-400 font-bold text-lg">
          MAZE SOLVED! Proceeding to coordinates...
        </div>
      )}
    </div>
  );
};

export default MazePuzzle;