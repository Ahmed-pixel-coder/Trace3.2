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

  return (
    <div className="min-h-screen bg-black text-green-400 slow-fade">
      {currentScreen === 'loading' && <LoadingScreen />}
      {currentScreen === 'briefing' && <BriefingScreen team={team} onStart={handleStartGame} />}
      {currentScreen === 'puzzle' && <PuzzleInterface team={team} />}
    </div>
  );
};

export default TeamInterface;