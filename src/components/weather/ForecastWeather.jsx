import { useState, useRef, useEffect } from 'react';

function ForecastWeather({ forecastData }) {
  const [activeDay, setActiveDay] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Gözlenebilirlik için Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  if (!forecastData || !forecastData.list) return null;

  // Group forecast data by day
  const groupByDay = () => {
    const grouped = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('tr-TR');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const dailyData = groupByDay();
  const days = Object.keys(dailyData).slice(0, 5); // Get next 5 days

  // Handle card hover/touch
  const handleDayHover = (day) => {
    setActiveDay(day);
  };

  const handleMouseLeave = () => {
    setActiveDay(null);
  };
  
  // Sıcaklığa göre renklendirilmiş arkaplan sınıfları
  const getTempColorClass = (temp) => {
    if (temp > 30) return 'from-red-400/70 to-orange-300/70 dark:from-red-600/80 dark:to-orange-500/80';
    if (temp > 25) return 'from-orange-400/70 to-yellow-300/70 dark:from-orange-600/80 dark:to-yellow-500/80';
    if (temp > 20) return 'from-yellow-400/70 to-green-300/70 dark:from-yellow-600/80 dark:to-green-500/80';
    if (temp > 15) return 'from-green-400/70 to-teal-300/70 dark:from-green-600/80 dark:to-teal-500/80';
    if (temp > 10) return 'from-teal-400/70 to-blue-300/70 dark:from-teal-600/80 dark:to-blue-500/80';
    if (temp > 0) return 'from-blue-400/70 to-indigo-300/70 dark:from-blue-600/80 dark:to-indigo-500/80';
    return 'from-indigo-400/70 to-purple-300/70 dark:from-indigo-600/80 dark:to-purple-500/80';
  };

  // Hava durumuna göre ikon sınıfı belirle
  const getWeatherIconClass = (condition) => {
    if (condition.includes('clear')) return 'weather-clear';
    if (condition.includes('cloud')) return 'weather-cloudy';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'weather-rainy';
    if (condition.includes('snow')) return 'weather-snowy';
    if (condition.includes('thunder')) return 'weather-thunder';
    return '';
  };
  
  // Günün verilerine göre özet oluştur
  const getDaySummary = (dayData) => {
    const conditions = dayData.map(item => item.weather[0].main.toLowerCase());
    const hasClear = conditions.some(c => c.includes('clear'));
    const hasCloudy = conditions.some(c => c.includes('cloud'));
    const hasRain = conditions.some(c => c.includes('rain') || c.includes('drizzle'));
    const hasSnow = conditions.some(c => c.includes('snow'));
    const hasThunder = conditions.some(c => c.includes('thunder'));
    
    if (hasThunder) return 'Fırtınalı';
    if (hasRain && hasSnow) return 'Karla karışık yağmurlu';
    if (hasSnow) return 'Karlı';
    if (hasRain) return 'Yağmurlu';
    if (hasCloudy && hasClear) return 'Parçalı bulutlu';
    if (hasCloudy) return 'Bulutlu';
    if (hasClear) return 'Açık';
    
    return dayData[0].weather[0].description;
  };
  
  // Gün geçişleri için animasyonlu gecikme
  const getAnimationDelay = (index) => {
    return isVisible ? `${index * 150}ms` : '0ms';
  };
  
  // Haftanın günlerini Türkçe formatla
  const formatDayNameTr = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Yarın';
    }
    
    return date.toLocaleDateString('tr-TR', { weekday: 'long' })
      .charAt(0).toUpperCase() + 
      date.toLocaleDateString('tr-TR', { weekday: 'long' }).slice(1);
  };

  return (
    <div ref={sectionRef} className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        5 Günlük Tahmin
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {days.map((day, idx) => {
          // Get daily data
          const dayData = dailyData[day];
          // Find mid-day forecast for representative icon/temp
          const midDayData = dayData.find(d => {
            const hour = new Date(d.dt * 1000).getHours();
            return hour >= 12 && hour <= 14;
          }) || dayData[0];
          
          // Calculate min/max temps for the day
          const minTemp = Math.round(Math.min(...dayData.map(d => d.main.temp_min)));
          const maxTemp = Math.round(Math.max(...dayData.map(d => d.main.temp_max)));
          
          // Check if this card is active
          const isActive = activeDay === day;
          
          // Weather summary
          const daySummary = getDaySummary(dayData);
          
          // Get background gradient based on temperature
          const bgGradient = getTempColorClass(maxTemp);
          
          // Weather condition for icon and effects
          const weatherCondition = midDayData.weather[0].main.toLowerCase();
          const iconClass = getWeatherIconClass(weatherCondition);
          
          return (
            <div 
              key={idx} 
              className={`
                relative overflow-hidden
                bg-gradient-to-b ${bgGradient} 
                backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10
                transition-all duration-500 ease-out
                cursor-pointer
              `}
              style={{ transitionDelay: getAnimationDelay(idx) }}
              onMouseEnter={() => handleDayHover(day)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Dekoratif arka plan elementleri */}
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${iconClass} opacity-40 blur-2xl`}></div>
                <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full ${iconClass} opacity-30 blur-3xl`}></div>
              </div>
              
              <div className="relative z-10 p-4 flex flex-col items-center">
                {/* Gün ve tarih */}
                <div className="text-center mb-3">
                  <h3 className="font-bold text-lg text-white drop-shadow">
                    {formatDayNameTr(day)}
                  </h3>
                  <p className="text-xs text-white/80">
                    {new Date(day).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                
                {/* Hava durumu ikonu ve durumu */}
                <div className="relative my-2">
                  <img 
                    src={`https://openweathermap.org/img/wn/${midDayData.weather[0].icon}@2x.png`}
                    alt={midDayData.weather[0].description}
                    className={`w-20 h-20 drop-shadow-lg filter saturate-[1.2] transition-all duration-300 ease-out ${isActive ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 rounded-full filter blur-xl opacity-70 animate-pulse-slow"></div>
                  )}
                </div>
                
                <p className="text-sm text-white mb-3 text-center font-medium drop-shadow">
                  {daySummary}
                </p>
                
                {/* Sıcaklık aralığı gösterimi */}
                <div className="w-full flex items-center space-x-1">
                  <div className="text-blue-100 dark:text-blue-200 font-medium text-sm">
                    {minTemp}°
                  </div>
                  
                  <div className="flex-1 mx-1">
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-red-100 dark:text-red-200 font-bold text-sm">
                    {maxTemp}°
                  </div>
                </div>
                
                {/* Rüzgar ve nem bilgisi */}
                <div className="flex justify-between w-full mt-3">
                  <div className="flex items-center text-xs text-white/80">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    {Math.round(midDayData.wind.speed * 3.6)} km/s
                  </div>
                  
                  <div className="flex items-center text-xs text-white/80">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14.5a4.5 4.5 0 00-4.5-4.5c-1.73 0-3.25.98-4 2.42A4.5 4.5 0 006 16.5 4.5 4.5 0 0010.5 21h7a4.5 4.5 0 100-9z" />
                    </svg>
                    {midDayData.main.humidity}%
                  </div>
                </div>
                
                {/* Aktif göstergesi */}
                {isActive && (
                  <div className="absolute -bottom-1 left-0 right-0 mx-auto w-12 h-1 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .weather-clear {
          background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0) 70%);
        }
        
        .weather-cloudy {
          background: radial-gradient(circle, rgba(200, 200, 200, 0.4) 0%, rgba(200, 200, 200, 0) 70%);
        }
        
        .weather-rainy {
          background: radial-gradient(circle, rgba(0, 150, 255, 0.4) 0%, rgba(0, 150, 255, 0) 70%);
        }
        
        .weather-snowy {
          background: radial-gradient(circle, rgba(200, 230, 255, 0.4) 0%, rgba(200, 230, 255, 0) 70%);
        }
        
        .weather-thunder {
          background: radial-gradient(circle, rgba(171, 108, 255, 0.4) 0%, rgba(171, 108, 255, 0) 70%);
        }
      `}</style>
    </div>
  );
}

export default ForecastWeather;
