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
      const teamKey = `team${team}` as 'team1' | 'team2';
      const teamState = prev[teamKey];
      if (teamState.completedPuzzles.includes(puzzleIndex)) {
        return prev;
      }
      return {
        ...prev,
        [teamKey]: {
          ...teamState,
          completedPuzzles: [...teamState.completedPuzzles, puzzleIndex],
          currentLocation: Math.min(puzzleIndex + 1, 2),
        },
      };
    });
  };

  const unlockFinalLocation = () => {
    setGameState(prev => ({
      ...prev,
      finalLocationUnlocked: true,
    }));
  };

  const updateTeamState = (team: number, newState: Partial<TeamState>) => {
    setGameState(prev => {
      const teamKey = `team${team}` as 'team1' | 'team2';
      return {
        ...prev,
        [teamKey]: {
          ...prev[teamKey],
          ...newState,
        },
      };
    });
  };

  useEffect(() => {
    localStorage.setItem('trace32-puzzle-game', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const saved = localStorage.getItem('trace32-puzzle-game');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, []);

  return (
    <GameContext.Provider value={{ gameState, completePuzzle, unlockFinalLocation, updateTeamState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};