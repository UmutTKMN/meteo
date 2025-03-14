import { useState, useEffect, useCallback } from 'react';

function AutoRefresh({ onRefresh, interval = 900000 }) { // Varsayılan 15 dakika (900000 ms)
  const [timeLeft, setTimeLeft] = useState(interval / 1000);
  const [isPaused, setIsPaused] = useState(false);

  const refresh = useCallback(() => {
    onRefresh();
    setTimeLeft(interval / 1000);
  }, [onRefresh, interval]);

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          refresh();
          return interval / 1000;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, interval, refresh]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400 mt-2">
      <button 
        onClick={refresh}
        className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-2"
        title="Şimdi Yenile"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      <button 
        onClick={togglePause}
        className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-2"
        title={isPaused ? "Otomatik yenilemeyi başlat" : "Otomatik yenilemeyi durdur"}
      >
        {isPaused ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
      
      <span className="mr-2">{formatTime(timeLeft)} sonra yenilenecek</span>
    </div>
  );
}

export default AutoRefresh;
