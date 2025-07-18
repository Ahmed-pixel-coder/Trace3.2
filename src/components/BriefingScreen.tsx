import React from 'react';
import { Play, Shield } from 'lucide-react';

interface BriefingScreenProps {
  team: number;
  onStart: () => void;
}

const BriefingScreen: React.FC<BriefingScreenProps> = ({ team, onStart }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 slow-fade">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-12 fade-in">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-green-400 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-green-400 mb-2 glitch" data-text="TRACE3.2 SYSTEM ONLINE">
                TRACE3.2 SYSTEM ONLINE
              </h1>
              <p className="text-lg text-gray-400">TEAM {team} - DETECTIVE TERMINAL</p>
            </div>
          </div>
        </div>

        <div className="text-center fade-in">
          <button
            onClick={onStart}
            className="inline-flex items-center px-8 py-4 bg-green-400 bg-opacity-20 border border-green-400 rounded-lg text-green-400 font-bold text-xl hover:bg-opacity-30 transition-all pulse-green"
          >
            <Play className="w-6 h-6 mr-2" />
            INITIATE MISSION
          </button>
        </div>

        <div className="text-center mt-8 text-xs text-gray-500">
          <p>CLASSIFIED OPERATION - TEAM {team} TERMINAL</p>
        </div>
      </div>
    </div>
  );
};

export default BriefingScreen;