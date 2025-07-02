import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center slow-fade">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-4xl font-bold mb-4 glitch" data-text="TRACE3.2">
            TRACE3.2
          </div>
          <div className="text-xl typewriter">
            [ SYSTEM INITIALIZING{dots} ]
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-block w-2 h-6 bg-green-400 blink ml-1"></div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <div className="scan-line p-2">
            ESTABLISHING SECURE CONNECTION...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;