import { useState, useEffect, useRef } from 'react';

function AlertBanner({ alerts }) {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

  // Uyarı olmadığında bileşeni görüntüleme
  if (!alerts || alerts.length === 0) return null;

  // Birden fazla uyarı varsa otomatik olarak değiştir
  useEffect(() => {
    if (alerts.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
        setIsVisible(true);
      }, 500); // Uyarılar arasında kısa bir gecikme
    }, 8000); // Her 8 saniyede bir uyarı değiştir

    return () => clearInterval(interval);
  }, [alerts.length]);

  // Mevcut uyarıyı al
  const currentAlert = alerts[currentAlertIndex];

  // Uyarı tipine göre stil ve ikon belirle
  const getAlertStyle = () => {
    switch (currentAlert.severity) {
      case 'extreme':
        return {
          bgClass: 'bg-red-600 dark:bg-red-800',
          icon: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'severe':
        return {
          bgClass: 'bg-orange-500 dark:bg-orange-700',
          icon: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'moderate':
        return {
          bgClass: 'bg-amber-500 dark:bg-amber-700',
          icon: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          bgClass: 'bg-blue-500 dark:bg-blue-700',
          icon: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const alertStyle = getAlertStyle();

  // Uyarıyı kapat
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      // Eğer birden fazla uyarı varsa sonraki uyarıya geç, değilse tamamen kaldır
      if (alerts.length > 1) {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
        setIsVisible(true);
      } else if (containerRef.current) {
        containerRef.current.style.display = 'none';
      }
    }, 500);
  };

  return (
    <div 
      ref={containerRef}
      className={`${alertStyle.bgClass} transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-white">
            {alertStyle.icon}
            <div>
              <p className="font-bold text-sm">{currentAlert.title}</p>
              <p className="text-sm opacity-90">{currentAlert.description}</p>
            </div>
          </div>

          {/* İndikatör: Birden fazla uyarı varsa nokta göstergesi */}
          {alerts.length > 1 && (
            <div className="flex space-x-1 mx-2">
              {alerts.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${index === currentAlertIndex ? 'bg-white' : 'bg-white/50'}`}
                ></div>
              ))}
            </div>
          )}

          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertBanner;
