// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBMZOgZynZfM-9oWdSy745ISmeRZgkRqJw",
    authDomain: "trace3-2.firebaseapp.com",
    projectId: "trace3-2",
    storageBucket: "trace3-2.firebasestorage.app",
    messagingSenderId: "871313519157",
    appId: "1:871313519157:web:f64aa4824f75ae496c377c",
    measurementId: "G-76Q7153TX7"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);