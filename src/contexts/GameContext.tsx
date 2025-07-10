import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveGameState, loadGameState } from '../database'; // Make sure this path is correct

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

export function GameProvider(): void {
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
}