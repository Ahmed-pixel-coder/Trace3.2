import React, { createContext, useContext, useState, useEffect } from 'react';


interface TeamState {
  currentLocation: number;
  completedPuzzles: number[];
  finalHalfCode: string;
  unlockedLocations: number[];
  codes: string[];
}

interface GameState {
  team1: TeamState;
  team2: TeamState;
  finalLocationUnlocked: boolean;
}

interface GameContextType {
  gameState: GameState;
  completePuzzle: (team: number, puzzleIndex: number) => void;
  unlockFinalLocation: () => void;
  updateTeamState: (team: number, newState: Partial<TeamState>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    team1: {
      currentLocation: 0,
      completedPuzzles: [],
      finalHalfCode: 'B',
      unlockedLocations: [0],
      codes: [],
    },
    team2: {
      currentLocation: 0,
      completedPuzzles: [],
      finalHalfCode: '06',
      unlockedLocations: [0],
      codes: [],
    },
    finalLocationUnlocked: false,
  });

  const completePuzzle = (team: number, puzzleIndex: number) => {
    setGameState(prev => {
      const teamKey = team === 1 ? 'team1' : 'team2';
      const updatedTeam = {
        ...prev[teamKey],
        completedPuzzles: [...prev[teamKey].completedPuzzles, puzzleIndex],
      };
      return {
        ...prev,
        [teamKey]: updatedTeam,
      };
    });
  };

  const unlockFinalLocation = () => {
    setGameState(prev => ({ ...prev, finalLocationUnlocked: true }));
  };

  const updateTeamState = (team: number, newState: Partial<TeamState>) => {
    setGameState(prev => {
      const teamKey = team === 1 ? 'team1' : 'team2';
      return {
        ...prev,
        [teamKey]: { ...prev[teamKey], ...newState },
      };
    });
  };

  const contextValue: GameContextType = {
    gameState,
    completePuzzle,
    unlockFinalLocation,
    updateTeamState,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};