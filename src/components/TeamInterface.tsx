import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import LoadingScreen from './LoadingScreen';
import BriefingScreen from './BriefingScreen';
import PuzzleInterface from './PuzzleInterface';

interface TeamInterfaceProps {
  team: number;
}

const TeamInterface: React.FC<TeamInterfaceProps> = ({ team }) => {
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'briefing' | 'puzzle'>('loading');
  const { gameState } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('briefing');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    setCurrentScreen('puzzle');
  };

  // Import ErrorBoundary from PuzzleInterface
  const ErrorBoundary = (window as any).React?.Component ? 
    (PuzzleInterface as any).type?.ErrorBoundary : 
    function FallbackErrorBoundary({ children }: { children: React.ReactNode }) {
      return <>{children}</>;
    };

  return (
    <div className="min-h-screen bg-black text-green-400 slow-fade">
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'briefing' && <BriefingScreen team={team} onStart={handleStartGame} />}
      {currentScreen === 'puzzle' && (
        <ErrorBoundary>
          <PuzzleInterface team={team} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default TeamInterface;