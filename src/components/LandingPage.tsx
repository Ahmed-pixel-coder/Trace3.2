import React from 'react';
import { useNavigate } from 'react-router-dom';

const TEAM_URLS = [
  '/team/1',
  '/team/2',
];
const LOCK_KEY = 'activeTeamLock';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTeamSelect = (team: number) => {
    // Use a separate lock for each team
    const teamLockKey = `${LOCK_KEY}_${team}`;
    const isLocked = localStorage.getItem(teamLockKey);
    if (!isLocked) {
      localStorage.setItem(teamLockKey, 'locked');
      navigate(TEAM_URLS[team - 1]);
    } else {
      alert(`Team ${team} interface is currently in use. Please wait until it is free.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 slow-fade">
      <h1 className="text-3xl font-bold mb-8 text-center">Select Your Team</h1>
      <div className="flex gap-16 justify-center items-center">
        {[1, 2].map((team) => (
          <div key={team} className="flex flex-col items-center gap-4">
            <button
              className="px-10 py-6 bg-green-400 text-black rounded font-bold text-2xl hover:bg-green-300 transition-all"
              onClick={() => handleTeamSelect(team)}
            >
              Enter as Team {team}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-gray-400 text-center">Each team can only use their own interface at a time. Use the release button if you need to free up an interface.</p>
    </div>
  );
};

export default LandingPage;
