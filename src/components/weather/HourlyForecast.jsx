import { useState, useRef, useEffect } from 'react';

function HourlyForecast({ forecastData }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Kaydırma göstergelerini kontrol et
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      setShowLeftArrow(container.scrollLeft > 10);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };
    
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleScroll);
    handleScroll(); // İlk durumu kontrol et
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll işlemleri
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };
  
  if (!forecastData || !forecastData.list) return null;

  const hourlyData = forecastData.list.slice(0, 8);
  
  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  // Sıcaklığa göre renklendirilmiş arkaplan sınıfları
  const getTempColorClass = (temp) => {
    if (temp > 30) return 'bg-gradient-to-b from-red-400/70 to-orange-300/70 dark:from-red-600/70 dark:to-orange-500/70 border-red-300 dark:border-red-700';
    if (temp > 25) return 'bg-gradient-to-b from-orange-400/70 to-yellow-300/70 dark:from-orange-600/70 dark:to-yellow-500/70 border-orange-300 dark:border-orange-700';
    if (temp > 20) return 'bg-gradient-to-b from-yellow-400/70 to-green-300/70 dark:from-yellow-600/70 dark:to-green-500/70 border-yellow-300 dark:border-yellow-700';
    if (temp > 15) return 'bg-gradient-to-b from-green-400/70 to-teal-300/70 dark:from-green-600/70 dark:to-teal-500/70 border-green-300 dark:border-green-700';
    if (temp > 10) return 'bg-gradient-to-b from-teal-400/70 to-blue-300/70 dark:from-teal-600/70 dark:to-blue-500/70 border-teal-300 dark:border-teal-700';
    if (temp > 0) return 'bg-gradient-to-b from-blue-400/70 to-indigo-300/70 dark:from-blue-600/70 dark:to-indigo-500/70 border-blue-300 dark:border-blue-700';
    return 'bg-gradient-to-b from-indigo-400/70 to-purple-300/70 dark:from-indigo-600/70 dark:to-purple-500/70 border-indigo-300 dark:border-indigo-700';
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Saatlik Tahminler
      </h2>
      
      <div className="relative">
        {/* Sol kaydırma butonu */}
        {showLeftArrow && (
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md transition-all duration-200 hover:bg-white dark:hover:bg-gray-700"
            onClick={() => scroll('left')}
            aria-label="Sola kaydır"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {/* Sağ kaydırma butonu */}
        {showRightArrow && (
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md transition-all duration-200 hover:bg-white dark:hover:bg-gray-700"
            onClick={() => scroll('right')}
            aria-label="Sağa kaydır"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 pt-2 px-2 -mx-2 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex space-x-4 min-w-max">
            {hourlyData.map((item, idx) => {
              const timeString = new Date(item.dt * 1000).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
              });
              
              const isActive = idx === activeIndex;
              const tempValue = Math.round(item.main.temp);
              const colorClass = getTempColorClass(tempValue);
              
              return (
                <div 
                  key={idx} 
                  className={`
                    relative flex-shrink-0 ${colorClass} 
                    backdrop-blur-md rounded-xl p-4 border border-white/30
                    w-28 flex flex-col items-center
                    transform transition-all duration-300 ease-out
                    cursor-pointer
                  `}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <p className="font-medium text-white drop-shadow-sm mb-1">{timeString}</p>
                  
                  <div 
                    className={`
                      relative transition-transform duration-300 ease-out
                      ${isActive ? 'scale-110' : 'scale-100'}
                    `}
                  >
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description} 
                      className={`w-16 h-16 drop-shadow-lg filter ${isActive ? 'brightness-105' : 'brightness-100'}`}
                    />
                    {isActive && (
                      <div className="absolute inset-0 animate-ping-slow opacity-70 rounded-full bg-white/30 filter blur-md"></div>
                    )}
                  </div>
                  
                  <div className={`text-2xl font-bold text-white drop-shadow-md transition-all duration-300`}>
                    {tempValue}°
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-xs text-white/90 mt-2 px-2.5 py-1 rounded-full bg-black/10 backdrop-blur-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span>{Math.round(item.wind.speed * 3.6)} km/s</span>
                  </div>
                  
                  {/* Aktif durumda ekstra bilgi göster */}
                  {isActive && (
                    <>
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/50 mx-auto w-12 rounded-full"></div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 px-1 py-0.5 rounded-bl-lg rounded-br-lg bg-white/30 text-white text-[10px] font-medium">
                        {item.main.humidity}% nem
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Scroll göstergesi */}
      <div className="flex justify-center mt-2 gap-1">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div 
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              showLeftArrow && idx === 0 || showRightArrow && idx === 3 ? 'w-4 bg-blue-500' : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
