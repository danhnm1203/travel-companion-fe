import { useState, useEffect } from 'react';
import { loadingMessages } from '@/data/mockData';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1800);

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-6">
      <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-8" />
      
      <div className="text-center min-h-[60px] flex items-center">
        <p className="text-lg text-gray-700 font-medium animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
}