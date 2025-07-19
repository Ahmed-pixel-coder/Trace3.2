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

  // Initialize and listen for changes in Firebase
  useEffect(() => {
    try {
      const gameRef = ref(db, 'gameState');
      // First, set initial state if it doesn't exist
      set(gameRef, defaultState).catch(error => {
        console.warn('Error setting initial game state:', error);
      });
      
      // Then listen for changes
      const unsubscribe = onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameState({
            ...defaultState, // Use default values as fallback
            ...data,         // Override with saved data
            team1: {
              ...defaultState.team1,
              ...(data.team1 || {})
            },
            team2: {
              ...defaultState.team2,
              ...(data.team2 || {})
            }
          });
        } else {
          setGameState(defaultState);
        }
      }, (error) => {
        console.error('Firebase read failed:', error);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }, []);

  // Write helpers with error handling
  const completePuzzle = (team: number, puzzleIndex: number) => {
    try {
      const teamKey = team === 1 ? 'team1' : 'team2';
      const prevCompleted = (gameState[teamKey]?.completedPuzzles || []);
      
      // Avoid duplicates
      if (!prevCompleted.includes(puzzleIndex)) {
        update(ref(db, `gameState/${teamKey}`), {
          completedPuzzles: [...prevCompleted, puzzleIndex],
        }).catch(error => {
          console.error('Error completing puzzle:', error);
        });
      }
    } catch (error) {
      console.error('Error in completePuzzle:', error);
    }
  };

  const unlockFinalLocation = () => {
    try {
      set(ref(db, 'gameState/finalLocationUnlocked'), true)
        .catch(error => {
          console.error('Error unlocking final location:', error);
        });
    } catch (error) {
      console.error('Error in unlockFinalLocation:', error);
    }
  };

  const updateTeamState = (team: number, newState: Partial<TeamState>) => {
    try {
      const teamKey = team === 1 ? 'team1' : 'team2';
      update(ref(db, `gameState/${teamKey}`), newState)
        .catch(error => {
          console.error('Error updating team state:', error);
        });
    } catch (error) {
      console.error('Error in updateTeamState:', error);
    }
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
