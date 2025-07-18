import { db } from './firebase';
import { ref, set } from 'firebase/database';

const defaultState = {
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

export function initFirebaseGameState() {
  set(ref(db, 'gameState'), defaultState);
  alert('Game state initialized in Firebase!');
}