import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Shield, AlertTriangle } from 'lucide-react';

const AccessControl: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { gameState } = useGame();

  const handleAccess = () => {
    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }

    // Simple access code validation (in production, this would be more secure)
    const validCodes = {
      1: 'DETECTIVE_A1',
      2: 'DETECTIVE_A2'
    };

    if (accessCode !== validCodes[selectedTeam as keyof typeof validCodes]) {
      setError('Invalid access code');
      return;
    }

    // Navigate to team page
    navigate(`/team${selectedTeam}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="terminal-border bg-gray-900 p-8 rounded-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-green-400 mr-2" />
            <div>
              <h1 className="text-xl font-bold text-green-400 glitch" data-text="TRACE3.2">
                TRACE3.2
              </h1>
              <p className="text-sm text-gray-400">SECURE ACCESS TERMINAL</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2">
              SELECT TEAM
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedTeam(1)}
                className={`p-3 border rounded text-center transition-all ${
                  selectedTeam === 1
                    ? 'border-green-400 bg-green-400 bg-opacity-20 text-green-400'
                    : 'border-gray-600 text-gray-400 hover:border-green-400'
                }`}
              >
                TEAM 1
              </button>
              <button
                onClick={() => setSelectedTeam(2)}
                className={`p-3 border rounded text-center transition-all ${
                  selectedTeam === 2
                    ? 'border-green-400 bg-green-400 bg-opacity-20 text-green-400'
                    : 'border-gray-600 text-gray-400 hover:border-green-400'
                }`}
              >
                TEAM 2
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2">
              ACCESS CODE
            </label>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full p-3 bg-black border border-gray-600 rounded text-green-400 font-mono focus:border-green-400 focus:outline-none"
              placeholder="Enter access code..."
            />
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleAccess}
            className="w-full p-3 bg-green-400 bg-opacity-20 border border-green-400 rounded text-green-400 font-bold hover:bg-opacity-30 transition-all pulse-green"
          >
            ACCESS TERMINAL
          </button>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>AUTHORIZED PERSONNEL ONLY</p>
          <p>Team 1 Code: DETECTIVE_A1 | Team 2 Code: DETECTIVE_A2</p>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;