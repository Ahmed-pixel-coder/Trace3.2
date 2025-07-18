import React, { useState, useEffect } from 'react';
import { initFirebaseGameState } from './initFirebaseGameState';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import LandingPage from './components/LandingPage';
import TeamInterface from './components/TeamInterface';
import PasswordPage from './components/PasswordPage';

const TeamWrapper: React.FC = () => {
  const { teamId } = useParams<{ teamId?: string }>();
  const teamNum = parseInt(teamId || '1', 10);
  return <TeamInterface team={teamNum} />;
};

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    initFirebaseGameState();
  }, []);

  if (!authenticated) {
    return <PasswordPage onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-black text-green-400 font-mono">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/team/:teamId" element={<TeamWrapper />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </GameProvider>
  );


  return (
    <GameProvider>
      <div className="min-h-screen bg-black text-green-400 font-mono">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/team/:teamId" element={<TeamWrapper />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </GameProvider>
  );
};

export default App;