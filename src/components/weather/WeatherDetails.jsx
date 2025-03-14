import { useState, useEffect, useRef } from "react";

function WeatherDetails({ weatherData }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!weatherData) return;

    // Başlangıç değerleri
    const initialValues = {
      feelsLike: 0,
      humidity: 0,
      windSpeed: 0,
      pressure: 900, // Daha gerçekçi bir başlangıç değeri
      visibility: 0,
      sunrise: 0,
      sunset: 0,
    };

    // Hedef değerler
    const targetValues = {
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6),
      pressure: weatherData.main.pressure,
      visibility: Math.round(weatherData.visibility / 1000),
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
    };

    setAnimatedValues(initialValues);

    // Gözlenebilirlik için Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          startAnimations(targetValues);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [weatherData]);

  const startAnimations = (targetValues) => {
    // Her değer için animasyon
    Object.keys(targetValues).forEach((key) => {
      if (key === "sunrise" || key === "sunset") return; // Zaman değerleri için animasyon yapma

      let startValue = key === "pressure" ? 900 : 0;
      const endValue = targetValues[key];
      const duration = 1500; // 1.5 saniye
      const stepTime = 20; // 20ms

      let currentValue = startValue;
      const totalSteps = duration / stepTime;
      const increment = (endValue - startValue) / totalSteps;

      const timer = setInterval(() => {
        currentValue += increment;

        if (
          (increment > 0 && currentValue >= endValue) ||
          (increment < 0 && currentValue <= endValue)
        ) {
          currentValue = endValue;
          clearInterval(timer);
        }

        setAnimatedValues((prev) => ({
          ...prev,
          [key]: Math.round(currentValue),
        }));
      }, stepTime);
    });
  };

  if (!weatherData) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const details = [
    {
      title: "Hissedilen",
      value: `${animatedValues.feelsLike || 0}°C`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "blue",
      valueForComparison: weatherData.main.feels_like,
      description:
        "Rüzgar ve nem faktörleri dahil, insan vücudunun algıladığı sıcaklık.",
    },
    {
      title: "Nem",
      value: `${animatedValues.humidity || 0}%`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14.5A4.5 4.5 0 0014.5 10c-1.73 0-3.25.98-4 2.42A4.5 4.5 0 006 16.5 4.5 4.5 0 0010.5 21h7a4.5 4.5 0 100-9z"
          />
        </svg>
      ),
      color: "teal",
      valueForComparison: weatherData.main.humidity,
      description:
        "Havadaki nem oranı. Yüksek değerler bunaltıcı hissedilir, düşük değerler kuruluğa neden olur.",
      gaugeValue: weatherData.main.humidity / 100, // 0-1 arası normalize edilmiş değer
    },
    {
      title: "Rüzgar",
      value: `${animatedValues.windSpeed || 0} km/s`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
          />
        </svg>
      ),
      color: "cyan",
      valueForComparison: weatherData.wind.speed * 3.6,
      description:
        "Rüzgar hızı. 20 km/h üzeri hafif, 40 km/h üzeri kuvvetli, 60 km/h üzeri şiddetli rüzgar olarak değerlendirilir.",
      gaugeValue: Math.min((weatherData.wind.speed * 3.6) / 100, 1), // 0-100 km/s arası normalize edilmiş değer
    },
    {
      title: "Basınç",
      value: `${animatedValues.pressure || 900} hPa`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "indigo",
      valueForComparison: weatherData.main.pressure,
      description:
        "Atmosfer basıncı. Yüksek değerler genellikle iyi hava koşullarını, düşük değerler fırtınaları işaret eder.",
      gaugeValue: (weatherData.main.pressure - 950) / 150, // Genellikle 950-1050 hPa arasında
    },
    {
      title: "Görüş",
      value: `${animatedValues.visibility || 0} km`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      color: "sky",
      valueForComparison: weatherData.visibility / 1000,
      description:
        "Görüş mesafesi. 1 km'den az ise sis veya şiddetli yağış olabilir.",
      gaugeValue: Math.min(weatherData.visibility / 10000, 1), // 0-10 km arası normalize edilmiş değer
    },
    {
      title: "Gündoğumu",
      value: formatTime(weatherData.sys.sunrise),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: "amber",
      valueForComparison: null, // Zaman için karşılaştırma yapılmıyor
      description: "Gün doğumu zamanı yerel saate göre.",
      isTime: true,
    },
    {
      title: "Günbatımı",
      value: formatTime(weatherData.sys.sunset),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
          />
          <circle cx="12" cy="7" r="4" strokeWidth="2" />
        </svg>
      ),
      color: "orange",
      valueForComparison: null, // Zaman için karşılaştırma yapılmıyor
      description: "Gün batımı zamanı yerel saate göre.",
      isTime: true,
    },
  ];

  // Renk değerlerini hesapla
  const getColorClasses = (color, value, isHovered) => {
    const colorMap = {
      blue: {
        light: {
          bg: isHovered ? "bg-blue-100" : "bg-blue-50",
          text: "text-blue-700",
          icon: "text-blue-600",
          ring: "ring-blue-400",
          glow: "bg-blue-400/20",
        },
        dark: {
          bg: isHovered ? "dark:bg-blue-900/70" : "dark:bg-blue-900/40",
          text: "dark:text-blue-300",
          icon: "dark:text-blue-400",
          ring: "dark:ring-blue-500",
          glow: "dark:bg-blue-400/30",
        },
      },
      teal: {
        light: {
          bg: isHovered ? "bg-teal-100" : "bg-teal-50",
          text: "text-teal-700",
          icon: "text-teal-600",
          ring: "ring-teal-400",
          glow: "bg-teal-400/20",
        },
        dark: {
          bg: isHovered ? "dark:bg-teal-900/70" : "dark:bg-teal-900/40",
          text: "dark:text-teal-300",
          icon: "dark:text-teal-400",
          ring: "dark:ring-teal-500",
          glow: "dark:bg-teal-400/30",
        },
      },
      cyan: {
        light: {
          bg: isHovered ? "bg-cyan-100" : "bg-cyan-50",
          text: "text-cyan-700",
          icon: "text-cyan-600",
          ring: "ring-cyan-400",
          glow: "bg-cyan-400/20",
        },
        dark: {
          bg: isHovered ? "dark:bg-cyan-900/70" : "dark:bg-cyan-900/40",
          text: "dark:text-cyan-300",
          icon: "dark:text-cyan-400",
          ring: "dark:ring-cyan-500",
          glow: "dark:bg-cyan-400/30",
        },
      },
      indigo: {
        light: {
          bg: isHovered ? "bg-indigo-100" : "bg-indigo-50",
          text: "text-indigo-700",
          icon: "text-indigo-600",
          ring: "ring-indigo-400",
          glow: "bg-indigo-400/20",
        },
        dark: {
          bg: isHovered ? "dark:bg-indigo-900/70" : "dark:bg-indigo-900/40",
          text: "dark:text-indigo-300",
          icon: "dark:text-indigo-400",
          ring: "dark:ring-indigo-500",
          glow: "dark:bg-indigo-400/30",
        },
      },
      sky: {
        light: {
          bg: isHovered ? "bg-sky-100" : "bg-sky-50",
          text: "text-sky-700",
          icon: "text-sky-600",
          ring: "ring-sky-400",
          glow: "bg-sky-400/20",
        },
        dark: {
          bg: isHovered ? "dark:bg-sky-900/70" : "dark:bg-sky-900/40",
          text: "dark:text-sky-300",
          icon: "dark:text-sky-400",
          ring: "dark:ring-sky-500",
          glow: "dark:bg-sky-400/30",
        },
      },
      amber: {
        light: {
          bg: isHovered ? "bg-amber-100" : "bg-amber-50",
          text: "text-amber-700",
          icon: "text-amber-600",
          ring: "ring-amber-400",
          glow: "bg-amber-400/20",
        },
        dark: {
          bg: isHovered ? "dark:bg-amber-900/70" : "dark:bg-amber-900/40",
          text: "dark:text-amber-300",
          icon: "dark:text-amber-400",
          ring: "dark:ring-amber-500",
          glow: "dark:bg-amber-400/30",
        },
      },
      orange: {
        light: {
          bg: isHovered ? "bg-orange-100" : "bg-orange-50",
          text: "text-orange-700",
          icon: "text-orange-600",
          ring: "ring-orange-400/20",
          glow: "bg-orange-400/20",
        },
        dark: {
          bg: isHovered ? "dark:bg-orange-900/70" : "dark:bg-orange-900/40",
          text: "dark:text-orange-300",
          icon: "dark:text-orange-400",
          ring: "dark:ring-orange-400/30",
          glow: "dark:bg-orange-400/30",
        },
      },
    };

    const classes = colorMap[color] || colorMap.blue;

    return {
      container: `${classes.light.bg} ${classes.dark.bg} backdrop-blur-md ${
        isHovered ? `ring-0 ${classes.light.ring} ${classes.dark.ring}` : ""
      }`,
      icon: `${classes.light.icon} ${classes.dark.icon}`,
      text: `${classes.light.text} ${classes.dark.text}`,
      glow: `${classes.light.glow} ${classes.dark.glow}`,
    };
  };

  // Her bir detay kartı için
  const renderDetailCard = (detail, index) => {
    const isHovered = hoveredIndex === index;
    const colorClasses = getColorClasses(
      detail.color,
      detail.valueForComparison,
      isHovered
    );
    const showGauge = detail.gaugeValue !== undefined && !detail.isTime;

    return (
      <div
        key={index}
        className={`
          ${colorClasses.container}
          relative overflow-hidden
          rounded-xl p-4 shadow-lg
          flex flex-col items-center justify-center text-center
          transition-all ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          cursor-pointer
        `}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Content */}
        <div className="relative z-10 w-full">
          <div
            className={`
            ${colorClasses.text} p-2 rounded-full mb-2 
            transition-all flex items-center justify-center
            ${isHovered ? "scale-110" : "scale-100"}
          `}
          >
            <div className={`${colorClasses.icon}`}>{detail.icon}</div>
          </div>

          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {detail.title}
          </h3>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {detail.value}
          </p>

          {/* Gauge indicator for values that have ranges */}
          {showGauge && (
            <div className="w-full mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClasses.icon.replace(
                  "text-",
                  "bg-"
                )}`}
              ></div>
            </div>
          )}

          {/* Description Tooltip */}
          {isHovered && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 text-xs text-gray-700 dark:text-gray-300 z-20 pointer-events-none animate-fade-in">
              {detail.description}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-3 h-3 rotate-45 bg-white dark:bg-gray-800"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Hava Durumu Detayları
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {details.map((detail, index) => renderDetailCard(detail, index))}
      </div>
    </div>
  );
}

export default WeatherDetails;
