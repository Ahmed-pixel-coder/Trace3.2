import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, onValue, update, set } from 'firebase/database';

// --- TypeScript interfaces ---
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

// --- Default state, used for first-time setup ---
const defaultState: GameState = {
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
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultState);

  // Listen for changes in Firebase
  useEffect(() => {
    const gameRef = ref(db, 'gameState');
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setGameState(data);
    });
    return () => unsubscribe();
  }, []);

  // Write helpers
  const completePuzzle = (team: number, puzzleIndex: number) => {
    const teamKey = team === 1 ? 'team1' : 'team2';
    const prevCompleted = (gameState[teamKey]?.completedPuzzles || []);
    // Avoid duplicates
    if (!prevCompleted.includes(puzzleIndex)) {
      update(ref(db, `gameState/${teamKey}`), {
        completedPuzzles: [...prevCompleted, puzzleIndex],
      });
    }
  };

  const unlockFinalLocation = () => {
    set(ref(db, 'gameState/finalLocationUnlocked'), true);
  };

  const updateTeamState = (team: number, newState: Partial<TeamState>) => {
    const teamKey = team === 1 ? 'team1' : 'team2';
    update(ref(db, `gameState/${teamKey}`), newState);
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

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}