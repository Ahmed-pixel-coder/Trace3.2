import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Shield, Users, Key, CheckCircle, AlertTriangle } from 'lucide-react';

interface FinalCodePanelProps {
  team: number;
}

// Import TEAM_LOCATIONS definition
const TEAM_LOCATIONS = {
  1: [
    { coords: '30.9948304, 29.5883294', name: 'LOCATION ALPHA', code: 'T-30' },
    { coords: '30.9942944, 29.5903226', name: 'LOCATION BETA', code: 'M-94' },
    { coords: '30.9982094, 29.5861847', name: 'LOCATION GAMMA', code: 'F-26' },
  ],
  2: [
    { coords: '30.9953647, 29.5882855', name: 'LOCATION ALPHA', code: 'I-78' },
    { coords: '30.9960832, 29.5871697', name: 'LOCATION BETA', code: 'K-55' },
    { coords: '30.9926352, 29.5926813', name: 'LOCATION GAMMA', code: 'R-13' },
  ],
};

const FinalCodePanel: React.FC<FinalCodePanelProps> = ({ team }) => {
  const { gameState, unlockFinalLocation } = useGame();
  const [finalCode, setFinalCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const teamKey = team === 1 ? 'team1' : 'team2';
  const otherTeamKey = team === 1 ? 'team2' : 'team1';
  const teamState = gameState[teamKey];
  const otherTeam = team === 1 ? 2 : 1;
  const otherTeamState = gameState[otherTeamKey];
  
  const bothTeamsReady = teamState.completedPuzzles.length === 3 && 
                         otherTeamState.completedPuzzles.length === 3;

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalCode.trim()) return;

    setIsSubmitting(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!bothTeamsReady) {
      setError('Both teams must complete all puzzles before the final code can be accepted.');
      setIsSubmitting(false);
      return;
    }

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
                onClick={async () => {

                  alert(`TEAM ${team} interface has been released.`);

                }}
                className="px-6 py-2 bg-gray-200 text-green-400 hover:bg-gray-600 transition-all rounded font-bold text-base"
>
                Release Team {team}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 slow-fade">
      {/* WARNING for multi-device limitation */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-2">
        <div className="bg-yellow-900 bg-opacity-80 border border-yellow-500 rounded p-3 text-yellow-200 text-center text-sm font-bold mb-2 shadow-lg">
          <span className="block mb-1">⚠️ <b>IMPORTANT:</b> Game progress is NOT synchronized between devices. Both teams must play on the <b>same device/browser</b> for the final code to work.</span>
          <span className="block">(If you want true multi-device play, ask your developer to add a backend or real-time sync!)</span>
        </div>
      </div>
      <div className="terminal-border bg-gray-900 p-4 sm:p-8 rounded-lg max-w-4xl w-full flex flex-col sm:flex-row gap-4 sm:gap-8 items-start overflow-x-auto box-border">
        {/* Sidebar: Unlocked Locations */}
        <div className="w-full sm:w-64 bg-black p-2 sm:p-4 rounded border border-green-400 flex-shrink-0 self-start mt-2 overflow-y-auto max-h-[40vh] sm:max-h-[70vh] break-words">
          <h3 className="text-green-400 font-bold mb-2 text-lg">Unlocked Locations</h3>
          <ul className="space-y-1">
  {TEAM_LOCATIONS[team as 1 | 2].map((loc, idx) => (
    <li key={idx} className="text-green-300 font-mono border-b border-green-700 pb-1 mb-1">
      <div className="font-bold">{loc.name}</div>
      <div className="text-xs text-green-500">Coords: {loc.coords}</div>
    </li>
  ))}
</ul>
        </div>
        {/* Main Protocol Content */}
        <div className="flex-1 w-full max-w-xl min-w-0">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-yellow-400 mr-2" />
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">FINAL PROTOCOL</h2>
              </div>
            </div>
            <p className="text-gray-400">Team coordination required</p>
          </div>

          {/* Code Assembly Section */}
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="bg-blue-900 bg-opacity-20 border border-blue-400 p-6 rounded">
              <div className="flex items-start mb-4">
                <Key className="w-6 h-6 text-blue-400 mr-2 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-400 mb-2">FINAL CODE ASSEMBLY</h3>
                  <p className="text-blue-200 text-sm mb-3">
                    Combine both team half-codes to create the complete final access code.
                  </p>
                  <div className="font-mono text-lg break-words">
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
                !!finalCode.trim() && !isSubmitting
                  ? 'bg-green-400 bg-opacity-20 border border-green-400 text-green-400 hover:bg-opacity-30 pulse-green'
                  : 'bg-gray-800 border border-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Final Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FinalCodePanel;