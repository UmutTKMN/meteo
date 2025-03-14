import { useState, useEffect } from 'react';

function Notification({ message, type = 'info', duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState(null);

  // Bildirim tipine göre stil sınıfları
  const typeStyles = {
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
    warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
  };

  // Bildirim ikonları
  const typeIcons = {
    info: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  useEffect(() => {
    // İlerleme çubuğu animasyonu için interval oluştur
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          setIsVisible(false);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    setIntervalId(id);

    // Otomatik kapanma için zamanlayıcı
    const timeout = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearInterval(id);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  // Erken kapatma
  const handleClose = () => {
    setIsVisible(false);
    if (intervalId) clearInterval(intervalId);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 max-w-sm border rounded-lg shadow-lg backdrop-blur-md transition-all transform animate-slide-in ${typeStyles[type]}`}>
      <div className="p-4 pr-10">
        <div className="flex items-center">
          {typeIcons[type]}
          <span className="text-sm font-medium">{message}</span>
        </div>
        
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* İlerleme çubuğu */}
      <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${type === 'info' ? 'bg-blue-500' : type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
        />
      </div>
    </div>
  );
}

export default Notification;
