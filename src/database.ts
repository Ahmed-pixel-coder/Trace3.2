// src/database.ts
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

// Load game state from Firebase
export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const docRef = doc(db, 'game', 'state');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as GameState;
    }
    return null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

// Save game state to Firebase
export const saveGameState = async (gameState: GameState): Promise<void> => {
  try {
    const docRef = doc(db, 'game', 'state');
    await setDoc(docRef, gameState);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};