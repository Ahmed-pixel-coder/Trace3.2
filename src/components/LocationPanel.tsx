import React, { useState } from 'react';
import { MapPin, Key, CheckCircle, Lock } from 'lucide-react';

interface LocationPanelProps {
  location: {
    coords: string;
    name: string;
    code: string;
  };
  locationIndex: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  onCodeSubmit: (locationIndex: number, code: string) => boolean;
  team: number;
}

const LocationPanel: React.FC<LocationPanelProps> = ({
  location,
  locationIndex,
  isUnlocked,
  isCompleted,
  onCodeSubmit,
  team,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsSubmitting(true);
    setError('');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = onCodeSubmit(locationIndex, inputCode.trim());
    
    if (success) {
      setInputCode('');
    } else {
      setError('INVALID CODE - ACCESS DENIED');
    }
    
    setIsSubmitting(false);
  };

  if (!isUnlocked) {
    return (
      <div className="terminal-border bg-gray-900 p-8 rounded-lg">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-500 mb-2">LOCATION LOCKED</h2>
          <p className="text-gray-400">Complete previous location to unlock access</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="terminal-border bg-green-900 bg-opacity-20 border-green-400 p-8 rounded-lg">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-400 mb-2">LOCATION CLEARED</h2>
          <p className="text-gray-300">Investigation complete - Moving to next objective</p>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-border bg-gray-900 p-8 rounded-lg slow-fade">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-6 h-6 text-green-400 mr-2" />
          <h2 className="text-xl font-bold text-green-400">{location.name}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-green-400 mb-2 flex items-center">
            <Key className="w-4 h-4 mr-1" />
            ACCESS CODE
          </label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter code..."
            className="w-full p-3 bg-black border border-gray-600 rounded text-green-400 font-mono focus:border-green-400 focus:outline-none"
            disabled={isSubmitting}
          />
        </div>
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 p-3 rounded">
            <div className="flex items-center">
              <span className="text-red-400 font-bold">{error}</span>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={!inputCode.trim() || isSubmitting}
          className={`w-full p-3 rounded font-bold transition-all ${
            inputCode.trim() && !isSubmitting
              ? 'bg-green-400 bg-opacity-20 border border-green-400 text-green-400 hover:bg-opacity-30 pulse-green'
              : 'bg-gray-800 border border-gray-600 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'PROCESSING...' : 'SUBMIT CODE'}
        </button>
      </form>
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>TEAM {team} | LOCATION {locationIndex + 1}/3 | STATUS: AWAITING CODE INPUT</p>
      </div>
    </div>
  );
};

export default LocationPanel;