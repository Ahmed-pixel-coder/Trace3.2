import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import MazePuzzle from './puzzles/MazePuzzle';
import BlockPuzzle from './puzzles/BlockPuzzle';
import NonogramPuzzle from './puzzles/NonogramPuzzle';
import CodeInputPanel from './CodeInputPanel';
import FinalCodePanel from './FinalCodePanel';
import { MapPin, Lock, CheckCircle } from 'lucide-react';

interface PuzzleInterfaceProps {
  team: number;
}

const TEAM_LOCATIONS = {
  1: [
    { coords: '30.9948304, 29.5883294', name: 'LOCATION ALPHA', code: 'T-30' },
    { coords: '30.9942944, 29.5903226', name: 'LOCATION BETA', code: 'M-94' },
    { coords: '30.9982094, 29.5861847', name: 'LOCATION GAMMA', code: 'F-26' },
  ],
  2: [
    { coords: '30.9953647, 29.5882855', name: 'LOCATION ALPHA', code: 'I-78' },
    { coords: '30.9960832, 29.5871697', name: 'LOCATION BETA', code: 'K-55' },
    { coords: '30.9926352, 29.5926813', name: 'LOCATION GAMMA', code: 'R-13' },
  ],
};

const TEAM_PUZZLES = {
  1: ['maze', 'blocks', 'nonogram'],
  2: ['maze', 'blocks', 'nonogram'],
};

const PuzzleInterface: React.FC<PuzzleInterfaceProps> = ({ team }) => {
  const { gameState, updateTeamState } = useGame();
  const [showCodeInput, setShowCodeInput] = useState(false); // Start with puzzle first
  const [showLocation, setShowLocation] = useState(false); // Track if location should be shown

  const teamState = gameState[`team${team}` as 'team1' | 'team2'];
  const locations = TEAM_LOCATIONS[team as keyof typeof TEAM_LOCATIONS];
  const puzzles = TEAM_PUZZLES[team as keyof typeof TEAM_PUZZLES];
  const currentPuzzleIndex = teamState.currentLocation;
  const currentPuzzleType = puzzles[currentPuzzleIndex];
  const allPuzzlesCompleted = teamState.completedPuzzles.length === 3;

  useEffect(() => {
    setShowCodeInput(false);
    setShowLocation(false);
  }, [currentPuzzleIndex]);

  const handlePuzzleComplete = () => {
    setShowCodeInput(true); 
  };

  const handleCodeSuccess = () => {
    const teamKey = `team${team}` as 'team1' | 'team2';
    const codes = [...gameState[teamKey].codes];
    codes[currentPuzzleIndex] = TEAM_LOCATIONS[team as keyof typeof TEAM_LOCATIONS][currentPuzzleIndex].code;
    updateTeamState(team, { codes });
    setShowCodeInput(false);
    setShowLocation(true); 
  };

  const renderPuzzle = () => {
    const puzzleProps = {
      onComplete: handlePuzzleComplete,
      isCompleted: teamState.completedPuzzles.includes(currentPuzzleIndex),
    };

    if (team === 2) {
      switch (currentPuzzleType) {
        case 'maze':
          return <MazePuzzle {...puzzleProps} />;
        case 'blocks':
          return <BlockPuzzle {...puzzleProps} />;
        case 'nonogram':
          return <NonogramPuzzle {...puzzleProps} />;
        default:
          return <MazePuzzle {...puzzleProps} />;
      }
    } else {
      switch (currentPuzzleType) {
        case 'maze':
          return <MazePuzzle {...puzzleProps} />;
        case 'blocks':
          return <BlockPuzzle {...puzzleProps} />;
        case 'nonogram':
          return <NonogramPuzzle {...puzzleProps} />;
        default:
          return <MazePuzzle {...puzzleProps} />;
      }
    }
  };

  if (allPuzzlesCompleted) {
    return <FinalCodePanel team={team} />;
  }

  return (
    <div className="min-h-screen bg-black p-4 slow-fade">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="terminal-border bg-gray-900 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-400 mb-2">
                TRACE3.2 - TEAM {team}
              </h1>
              <p className="text-gray-400">Detective Terminal | Status: ACTIVE</p>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Locations Sidebar */}
          <div className="lg:col-span-1">
            <div className="terminal-border bg-gray-900 p-4 rounded-lg mb-6">
              <h3 className="text-green-400 font-bold mb-4 text-lg">Unlocked Locations</h3>
              <ul className="space-y-2">
                {locations.map((loc, idx) =>
                  teamState.codes[idx] ? (
                    <li key={loc.name} className="text-green-300 font-mono text-sm">
                      <span className="font-bold">{loc.name}:</span> {loc.coords}
                    </li>
                  ) : null
                )}
                {teamState.codes.filter(Boolean).length === 0 && (
                  <li className="text-gray-500 text-sm">No locations unlocked yet.</li>
                )}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3">
            {/* PUZZLE FIRST */}
            {!showCodeInput && !showLocation && !teamState.codes[currentPuzzleIndex] && (
              <div className="terminal-border bg-gray-900 p-8 rounded-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-green-400 mb-2">
                    {locations[currentPuzzleIndex].name} - PUZZLE {currentPuzzleIndex + 1}
                  </h2>
                  <p className="text-gray-400">Complete the puzzle to unlock code entry</p>
                </div>
                {renderPuzzle()}
              </div>
            )}
            {/* CODE INPUT PANEL AFTER PUZZLE */}
            {showCodeInput && !showLocation && !teamState.codes[currentPuzzleIndex] && (
              <CodeInputPanel
                team={team}
                location={locations[currentPuzzleIndex]}
                locationIndex={currentPuzzleIndex}
                onSuccess={handleCodeSuccess}
              />
            )}
            {/* LOCATION PAGE ONLY AFTER CODE IS ENTERED */}
            {showLocation && teamState.codes[currentPuzzleIndex] && (
              <div className="terminal-border bg-black p-8 rounded-lg mt-8">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-green-400 mb-2">{locations[currentPuzzleIndex].name} - LOCATION</h2>
                  <div className="text-gray-400 mb-2">Coordinates:</div>
                  <div className="text-xl font-mono text-green-400">{locations[currentPuzzleIndex].coords}</div>
                </div>
                <button
                  className="mt-6 px-6 py-3 bg-green-400 bg-opacity-20 border border-green-400 rounded text-green-400 font-bold text-lg hover:bg-opacity-30 transition-all pulse-green"
                  onClick={() => {
                    setShowLocation(false);
                    if (currentPuzzleIndex + 1 < locations.length) {
                      updateTeamState(team, { currentLocation: currentPuzzleIndex + 1 });
                    } else {
                      updateTeamState(team, { completedPuzzles: [0, 1, 2] });
                    }
                  }}
                >
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleInterface;