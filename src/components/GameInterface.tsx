import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import LocationPanel from './LocationPanel';
import FinalCodePanel from './FinalCodePanel';
import CodeInputPanel from './CodeInputPanel';

interface GameInterfaceProps {
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

const GameInterface: React.FC<GameInterfaceProps> = ({ team }) => {
  const { gameState, updateTeamState } = useGame();
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [codeEntered, setCodeEntered] = useState(false);
  const teamState = gameState[`team${team}` as 'team1' | 'team2'];
  const locations = TEAM_LOCATIONS[team as keyof typeof TEAM_LOCATIONS];

  const handleLocationSelect = (index: number) => {
    if (teamState.unlockedLocations.includes(index)) {
      setSelectedLocation(index);
    }
  };

  const handleCodeSubmit = (locationIndex: number, code: string) => {
    const expectedCode = locations[locationIndex].code;
    if (code.toUpperCase() === expectedCode.toUpperCase()) {
      const newUnlockedLocations = [...teamState.unlockedLocations];
      if (locationIndex + 1 < locations.length && !newUnlockedLocations.includes(locationIndex + 1)) {
        newUnlockedLocations.push(locationIndex + 1);
      }
      
      const newCodes = [...teamState.codes];
      newCodes[locationIndex] = code;

      updateTeamState(team, {
        unlockedLocations: newUnlockedLocations,
        codes: newCodes,
        currentLocation: Math.min(locationIndex + 1, locations.length - 1),
      });

      return true;
    }
    return false;
  };

  const handleInitialCodeSubmit = (code: string) => {
    // Only allow if code matches the first location's code
    if (code.toUpperCase() === locations[0].code.toUpperCase()) {
      setCodeEntered(true);
      // Optionally unlock the first location if not already
      if (!teamState.unlockedLocations.includes(0)) {
        updateTeamState(team, {
          ...teamState,
          unlockedLocations: [0],
        });
      }
      return true;
    }
    return false;
  };

  const allLocationsCompleted = teamState.unlockedLocations.length === locations.length;

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="terminal-border bg-gray-900 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-400 mb-2">
                TRACE3.2 - TEAM {team} CONTROL
              </h1>
              <p className="text-gray-400">Detective A Terminal | Status: ACTIVE</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">MISSION PROGRESS</div>
              <div className="text-xl font-bold text-green-400">
                {teamState.unlockedLocations.length - 1}/{locations.length} COMPLETE
              </div>
            </div>
          </div>
        </div>
        {!codeEntered ? (
          <div className="max-w-md mx-auto">
            <CodeInputPanel
              team={team}
              location={{ name: 'INITIAL ACCESS', coords: '' }}
              locationIndex={-1}
              onSuccess={() => setCodeEntered(true)}
            />
          </div>
        ) : (
          // Main Panel only, investigation sites panel removed
          <div>
            {/* Only show LocationPanel after code is entered and location is unlocked */}
            {!allLocationsCompleted && teamState.unlockedLocations.includes(selectedLocation) ? (
              <LocationPanel
                location={locations[selectedLocation]}
                locationIndex={selectedLocation}
                isUnlocked={teamState.unlockedLocations.includes(selectedLocation)}
                isCompleted={!!teamState.codes[selectedLocation]}
                onCodeSubmit={handleCodeSubmit}
                team={team}
              />
            ) : (
              <FinalCodePanel team={team} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;