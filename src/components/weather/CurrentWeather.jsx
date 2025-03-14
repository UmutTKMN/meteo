import { useState, useEffect, useRef } from "react";

function CurrentWeather({ weatherData, isLoading }) {
  const [timeOfDay, setTimeOfDay] = useState("day");
  const cardRef = useRef(null);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setTimeOfDay(currentHour >= 6 && currentHour < 18 ? "day" : "night");
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0 w-full md:w-1/2">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-3/4 mb-3"></div>
            <div className="h-5 bg-gray-300/70 dark:bg-gray-700/70 rounded-full w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded-full w-2/3"></div>
          </div>
          <div className="flex items-center w-full md:w-1/2 justify-center md:justify-end">
            <div className="rounded-full bg-gray-300 dark:bg-gray-700 w-16 h-16 mr-4"></div>
            <div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-full w-24 mb-2"></div>
              <div className="h-4 bg-gray-300/70 dark:bg-gray-700/70 rounded-full w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="rounded-2xl p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-lg text-center text-gray-700 dark:text-gray-300">
        <p>Hava durumu verisi bulunamadı. Lütfen bir konum arayın.</p>
      </div>
    );
  }

  // Hava durumuna göre farklı arkaplan gradient oluştur
  const getBackgroundStyle = () => {
    const condition = weatherData.weather[0].main.toLowerCase();
    const temp = weatherData.main.temp;
    
    // Sıcaklığa dayalı renk gradiyenti
    let tempColorClass = '';
    if (temp > 30) tempColorClass = 'from-red-400 via-orange-300 to-yellow-200 dark:from-red-700 dark:via-orange-600 dark:to-amber-500';
    else if (temp > 25) tempColorClass = 'from-orange-400 via-amber-300 to-yellow-200 dark:from-orange-700 dark:via-amber-600 dark:to-yellow-500';
    else if (temp > 20) tempColorClass = 'from-yellow-400 via-yellow-300 to-green-200 dark:from-yellow-600 dark:via-yellow-500 dark:to-green-400';
    else if (temp > 15) tempColorClass = 'from-green-400 via-teal-300 to-blue-200 dark:from-green-600 dark:via-teal-500 dark:to-blue-400';
    else if (temp > 10) tempColorClass = 'from-teal-400 via-cyan-300 to-blue-200 dark:from-teal-600 dark:via-cyan-500 dark:to-blue-400';
    else if (temp > 0) tempColorClass = 'from-blue-400 via-indigo-300 to-violet-200 dark:from-blue-600 dark:via-indigo-500 dark:to-violet-400';
    else tempColorClass = 'from-indigo-400 via-blue-300 to-cyan-200 dark:from-indigo-700 dark:via-blue-600 dark:to-cyan-500';

    // Hava koşuluna dayalı efektler
    if (condition.includes("clear")) {
      return {
        background: `bg-gradient-to-br ${tempColorClass}`,
        additionalClass: "clear-weather"
      };
    } else if (condition.includes("cloud")) {
      return {
        background: "bg-gradient-to-br from-gray-300 via-blue-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
        additionalClass: "cloudy-weather"
      };
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return {
        background: "bg-gradient-to-br from-blue-400 via-blue-300 to-gray-300 dark:from-blue-900 dark:via-blue-800 dark:to-gray-700",
        additionalClass: "rainy-weather"
      };
    } else if (condition.includes("snow")) {
      return {
        background: "bg-gradient-to-br from-blue-100 via-slate-200 to-white dark:from-blue-300 dark:via-slate-300 dark:to-white",
        additionalClass: "snowy-weather"
      };
    } else if (condition.includes("thunder")) {
      return {
        background: "bg-gradient-to-br from-gray-700 via-purple-500 to-indigo-600 dark:from-gray-900 dark:via-purple-700 dark:to-indigo-800",
        additionalClass: "thunder-weather"
      };
    }
    
    return {
      background: `bg-gradient-to-br ${tempColorClass}`,
      additionalClass: ""
    };
  };

  const bgStyle = getBackgroundStyle();
  
  // Hava durumu dinamik ikon animasyonları
  const getWeatherIcon = () => {
    const condition = weatherData.weather[0].main.toLowerCase();
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    
    return (
      <div className="relative flex items-center justify-center">
        <img
          src={iconUrl}
          alt={weatherData.weather[0].description}
          className={`w-20 h-20 z-10 transition-all duration-500`}
        />
        {/* Animasyonlu arka plan efekti */}
        <div className={`absolute inset-0 rounded-full blur-lg opacity-70`}
          style={{
            background: condition.includes("clear") ? "radial-gradient(circle, rgba(255,215,0,0.7) 0%, rgba(255,215,0,0) 70%)" :
                      condition.includes("rain") ? "radial-gradient(circle, rgba(0,150,255,0.7) 0%, rgba(0,150,255,0) 70%)" :
                      condition.includes("snow") ? "radial-gradient(circle, rgba(200,230,255,0.7) 0%, rgba(200,230,255,0) 70%)" :
                      condition.includes("thunder") ? "radial-gradient(circle, rgba(171,108,255,0.7) 0%, rgba(171,108,255,0) 70%)" :
                      "radial-gradient(circle, rgba(200,200,200,0.7) 0%, rgba(200,200,200,0) 70%)"
          }}
        ></div>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl p-6 backdrop-blur-md overflow-hidden relative ${bgStyle.background} ${bgStyle.additionalClass} shadow-lg transition-all duration-300 ease-out border border-white/20 dark:border-white/10`}
    >

      <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
        <div 
          className="text-center md:text-left mb-4 md:mb-0"
        >
          <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md flex items-center">
            <span>{weatherData.name}</span>
            <svg
              className="w-5 h-5 ml-2 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </h2>
          <p className="text-lg text-white/90 drop-shadow">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-white/80 mt-1 capitalize drop-shadow font-medium">
            {weatherData.weather[0].description}
          </p>
        </div>

        <div 
          className="flex items-center"
        >
          {getWeatherIcon()}
          <div className="text-white ml-2">
            <div className="text-5xl font-bold tracking-tighter drop-shadow-md">
              {Math.round(weatherData.main.temp)}
              <span className="text-4xl">°C</span>
            </div>
            <div className="flex items-center text-sm opacity-90">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {Math.round(weatherData.main.temp_max)}°
              </span>
              <span className="mx-2">|</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {Math.round(weatherData.main.temp_min)}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
