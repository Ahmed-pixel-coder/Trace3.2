import React, { useState } from 'react';
import { MapPin, Key, AlertTriangle } from 'lucide-react';

interface CodeInputPanelProps {
  team: number;
  location: {
    coords: string;
    name: string;
  };
  locationIndex: number;
  onSuccess: () => void;
}

const EXPECTED_CODES = {
  1: ['T-30', 'M-94', 'F-26'],
  2: ['I-78', 'K-55', 'R-13'],
};

const CodeInputPanel: React.FC<CodeInputPanelProps> = ({
  team,
  location,
  locationIndex,
  onSuccess,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsSubmitting(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const expectedCode = EXPECTED_CODES[team as keyof typeof EXPECTED_CODES][locationIndex];
    if (inputCode.trim() === expectedCode) {
      onSuccess();
    } else {
      setError('INVALID CODE - ACCESS DENIED');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="terminal-border bg-gray-900 p-8 rounded-lg slow-fade">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-6 h-6 text-green-400 mr-2" />
          <h2 className="text-xl font-bold text-green-400">{location.name !== 'INITIAL ACCESS' ? location.name : 'ACCESS AUTHORIZATION'}</h2>
        </div>
        {/* Only show coordinates if NOT in code input mode */}
        {false && location.name !== 'INITIAL ACCESS' && (
          <div className="bg-black p-4 rounded border border-gray-700 mb-6">
            <div className="text-sm text-gray-400 mb-2">COORDINATES</div>
            <div className="text-xl font-mono text-green-400">{location.coords}</div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-green-400 mb-2 flex items-center">
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
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
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
        <p>TEAM {team} | {location.name !== 'INITIAL ACCESS' ? `LOCATION ${locationIndex + 1}/3` : 'ACCESS PANEL'} | STATUS: AWAITING CODE INPUT</p>
      </div>
    </div>
  );
};

export default CodeInputPanel;