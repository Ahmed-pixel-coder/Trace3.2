import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBMZOgZynZfM-9oWdSy745ISmeRZgkRqJw",
  authDomain: "trace3-2.firebaseapp.com",
  databaseURL: "https://trace3-2-default-rtdb.firebaseio.com",
  projectId: "trace3-2",
  storageBucket: "trace3-2.firebasestorage.app",
  messagingSenderId: "871313519157",
  appId: "1:871313519157:web:f64aa4824f75ae496c377c",
  measurementId: "G-76Q7153TX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);