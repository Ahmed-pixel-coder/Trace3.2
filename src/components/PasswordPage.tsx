import React, { useState, ChangeEvent, FormEvent } from 'react';

const PASSWORD = 'A Mayorka Trail';

interface PasswordPageProps {
  onSuccess: () => void;
}

const PasswordPage: React.FC<PasswordPageProps> = ({ onSuccess }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === PASSWORD) {
      setError('');
      onSuccess();
    } else {
      setError('ACCESS DENIED - Try again!');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
      <div className="terminal-border bg-gray-900 p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">SECURE ACCESS</h1>
        <p className="text-gray-400 mb-4">What game are we playing?</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Enter password..."
            className="w-full p-4 bg-black border border-gray-600 rounded text-green-400 font-mono text-xl text-center focus:border-green-400 focus:outline-none"
            autoFocus
          />
          {error && <div className="text-red-400 font-bold">{error}</div>}
          <button
            type="submit"
            className="w-full p-4 rounded font-bold text-xl transition-all bg-green-400 bg-opacity-20 border border-green-400 text-green-400 hover:bg-opacity-30 pulse-green"
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPage;
