import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Shield, Users, Key, CheckCircle, AlertTriangle } from 'lucide-react';

interface FinalCodePanelProps {
  team: number;
}

const FinalCodePanel: React.FC<FinalCodePanelProps> = ({ team }) => {
  const { gameState, unlockFinalLocation } = useGame();
  const [finalCode, setFinalCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const teamState = gameState[`team${team}` as 'team1' | 'team2'];
  const otherTeam = team === 1 ? 2 : 1;
  const otherTeamState = gameState[`team${otherTeam}` as 'team1' | 'team2'];
  
  const bothTeamsReady = teamState.completedPuzzles.length === 3 && 
                         otherTeamState.completedPuzzles.length === 3;

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalCode.trim()) return;

    setIsSubmitting(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (finalCode.trim().toUpperCase() === 'B-06') {
      unlockFinalLocation();
    } else {
      setError('INCORRECT FINAL CODE - TEAM COORDINATION REQUIRED');
    }
    
    setIsSubmitting(false);
  };

  if (gameState.finalLocationUnlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 slow-fade">
        <div className="terminal-border bg-green-900 bg-opacity-20 border-green-400 p-8 rounded-lg max-w-2xl w-full">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-400 mb-4">FINAL LOCATION UNLOCKED</h2>
            <p className="text-xl text-green-300 mb-2">KEYS TO FREE DETECTIVES IDENTIFIED</p>
          </div>
          
          <div className="bg-black p-6 rounded border border-green-400 mb-6">
            <div className="text-sm text-gray-400 mb-2">FINAL COORDINATES</div>
            <div className="text-3xl font-mono text-green-400 text-center">30.9981151, 29.5858306</div>
          </div>

          <div className="bg-green-900 bg-opacity-20 border border-green-400 p-6 rounded mb-8">
            <div className="text-center">
              <h3 className="text-lg font-bold text-green-400 mb-2">MISSION ACCOMPLISHED</h3>
              <p className="text-green-300">Both teams have successfully completed all objectives.</p>
            </div>
          </div>

          <div className="flex gap-8 justify-center mt-8">
            {[1, 2].map((team) => (
              <button
                key={team}
                className="px-6 py-2 bg-gray-700 text-green-400 rounded font-bold text-base hover:bg-gray-600 transition-all"
                onClick={() => {
                  const teamLockKey = `activeTeamLock_${team}`;
                  localStorage.removeItem(teamLockKey);
                  localStorage.removeItem('trace32-puzzle-game'); // Clear saved progress on release
                  alert(`Team ${team} interface has been released.`);
                }}
              >
                Release Team {team} Interface
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 slow-fade">
      <div className="terminal-border bg-gray-900 p-8 rounded-lg max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-yellow-400 mr-2" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">FINAL PROTOCOL</h2>
              <p className="text-gray-400">Team coordination required</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black p-6 rounded border border-gray-600">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-green-400 mr-2" />
              <h3 className="font-bold text-green-400">TEAM {team}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Puzzles Completed:</span>
                <span className="text-green-400">{teamState.completedPuzzles.length}/3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Half-Code:</span>
                {/* Half-code hidden for final protocol */}
                <span className="text-gray-500 font-mono text-lg">•••</span>
              </div>
            </div>
          </div>

          <div className="bg-black p-6 rounded border border-gray-600">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-yellow-400 mr-2" />
              <h3 className="font-bold text-yellow-400">TEAM {otherTeam}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Puzzles Completed:</span>
                <span className={otherTeamState.completedPuzzles.length >= 3 ? 'text-green-400' : 'text-yellow-400'}>
                  {otherTeamState.completedPuzzles.length}/3
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Half-Code:</span>
                {/* Half-code hidden for final protocol */}
                <span className="text-gray-500 font-mono text-lg">•••</span>
              </div>
            </div>
          </div>
        </div>

        {!bothTeamsReady ? (
          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-500 p-6 rounded text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="font-bold text-yellow-400 mb-2">WAITING FOR OTHER TEAM</h3>
            <p className="text-yellow-200">Both teams must complete all puzzles before final protocol.</p>
          </div>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="bg-blue-900 bg-opacity-20 border border-blue-400 p-6 rounded">
              <div className="flex items-start mb-4">
                <Key className="w-6 h-6 text-blue-400 mr-2 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-400 mb-2">FINAL CODE ASSEMBLY</h3>
                  <p className="text-blue-200 text-sm mb-3">
                    Combine both team half-codes to create the complete final access code.
                  </p>
                  <div className="font-mono text-lg">
                    <span className="text-green-400">Team 1: •••</span>
                    <span className="text-gray-400"> + </span>
                    <span className="text-green-400">Team 2: •••</span>
                    <span className="text-gray-400"> = Complete Code</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                ENTER COMPLETE FINAL CODE
              </label>
              <input
                type="text"
                value={finalCode}
                onChange={(e) => setFinalCode(e.target.value)}
                placeholder="Enter combined code..."
                className="w-full p-4 bg-black border border-gray-600 rounded text-green-400 font-mono text-xl text-center focus:border-green-400 focus:outline-none"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-400 font-bold">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!finalCode.trim() || isSubmitting}
              className={`w-full p-4 rounded font-bold text-xl transition-all ${
                finalCode.trim() && !isSubmitting
                  ? 'bg-green-400 bg-opacity-20 border border-green-400 text-green-400 hover:bg-opacity-30 pulse-green'
                  : 'bg-gray-800 border border-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'PROCESSING FINAL CODE...' : 'EXECUTE FINAL PROTOCOL'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FinalCodePanel;