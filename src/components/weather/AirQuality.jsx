import { useState, useRef, useEffect } from 'react';

function AirQuality({ aqiData }) {
  const [activeParam, setActiveParam] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({});
  const sectionRef = useRef(null);

  // Gözlenebilirlik için Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          startAnimations();
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

  // In a real application, you would fetch AQI data from an API
  // This is a placeholder implementation
  const demoAqi = aqiData || {
    aqi: 2,
    components: {
      co: 201.94,
      no: 0.87,
      no2: 6.94,
      o3: 43.64,
      so2: 2.25,
      pm2_5: 7.13,
      pm10: 10.22,
      nh3: 1.07
    }
  };

  // Pollutant parameters with descriptions and health effects
  const pollutants = [
    {
      id: 'pm2_5',
      name: 'PM2.5',
      value: demoAqi.components.pm2_5,
      unit: 'µg/m³',
      color: 'red',
      description: 'İnce parçacıklı madde (çapı ≤ 2.5 µm)',
      healthEffect: 'Solunum ve kardiyovasküler hastalıklara neden olabilir.',
      limit: 25, // WHO guideline value
      normalizedValue: Math.min(demoAqi.components.pm2_5 / 25, 1)
    },
    {
      id: 'pm10',
      name: 'PM10',
      value: demoAqi.components.pm10,
      unit: 'µg/m³',
      color: 'orange',
      description: 'Kaba parçacıklı madde (çapı ≤ 10 µm)',
      healthEffect: 'Solunum yollarını tahriş edebilir.',
      limit: 50, // WHO guideline value
      normalizedValue: Math.min(demoAqi.components.pm10 / 50, 1)
    },
    {
      id: 'o3',
      name: 'O₃',
      value: demoAqi.components.o3,
      unit: 'µg/m³',
      color: 'blue',
      description: 'Ozon',
      healthEffect: 'Akciğerleri tahriş edebilir, astımı tetikleyebilir.',
      limit: 100, // WHO guideline value
      normalizedValue: Math.min(demoAqi.components.o3 / 100, 1)
    },
    {
      id: 'no2',
      name: 'NO₂',
      value: demoAqi.components.no2,
      unit: 'µg/m³',
      color: 'amber',
      description: 'Azot dioksit',
      healthEffect: 'Solunum yolu enfeksiyonları riskini artırabilir.',
      limit: 40, // WHO guideline value
      normalizedValue: Math.min(demoAqi.components.no2 / 40, 1)
    },
    {
      id: 'so2',
      name: 'SO₂',
      value: demoAqi.components.so2,
      unit: 'µg/m³',
      color: 'purple',
      description: 'Kükürt dioksit',
      healthEffect: 'Solunum sorunlarına neden olabilir, astımı şiddetlendirebilir.',
      limit: 20, // WHO guideline value
      normalizedValue: Math.min(demoAqi.components.so2 / 20, 1)
    },
    {
      id: 'co',
      name: 'CO',
      value: demoAqi.components.co,
      unit: 'µg/m³',
      color: 'gray',
      description: 'Karbon monoksit',
      healthEffect: 'Vücuda oksijen gitmesini engelleyebilir.',
      limit: 4000, // Converted WHO guideline value
      normalizedValue: Math.min(demoAqi.components.co / 4000, 1)
    }
  ];
  
  // AQI index descriptions
  const aqiLevels = [
    { level: 1, label: 'İyi', color: 'bg-green-500', textColor: 'text-green-500', description: 'Hava kalitesi tatmin edici ve hava kirliliği düşük riskli.' },
    { level: 2, label: 'Orta', color: 'bg-yellow-500', textColor: 'text-yellow-500', description: 'Hava kalitesi kabul edilebilir, ancak bazı kirleticiler hassas gruplar için sağlık endişesi oluşturabilir.' },
    { level: 3, label: 'Hassas Gruplar İçin Sağlıksız', color: 'bg-orange-500', textColor: 'text-orange-500', description: 'Hassas gruplar sağlık etkileri yaşayabilir. Genel nüfus etkilenmez.' },
    { level: 4, label: 'Sağlıksız', color: 'bg-red-500', textColor: 'text-red-500', description: 'Herkes sağlık etkileri yaşamaya başlayabilir; hassas gruplar için daha ciddi sağlık etkileri görülebilir.' },
    { level: 5, label: 'Çok Sağlıksız', color: 'bg-purple-500', textColor: 'text-purple-500', description: 'Sağlık uyarısı: herkes için daha ciddi sağlık etkileri yaşanabilir.' },
  ];

  // Find current AQI level info
  const currentAqiLevel = aqiLevels.find(level => level.level === demoAqi.aqi) || aqiLevels[0];

  // Animasyon başlatma fonksiyonu
  const startAnimations = () => {
    // Başlangıç değerleri
    const initialValues = {};
    pollutants.forEach(pollutant => {
      initialValues[pollutant.id] = 0;
    });
    initialValues['aqi'] = 0;
    
    setAnimatedValues(initialValues);
    
    // Her kirletici için animasyon
    const targetValues = {};
    pollutants.forEach(pollutant => {
      targetValues[pollutant.id] = pollutant.value;
    });
    targetValues['aqi'] = demoAqi.aqi;
    
    // Animasyon
    Object.keys(targetValues).forEach(key => {
      const startValue = 0;
      const endValue = targetValues[key];
      const duration = 1500; // 1.5 saniye
      const stepTime = 20; // 20ms
      
      let currentValue = startValue;
      const totalSteps = duration / stepTime;
      const increment = (endValue - startValue) / totalSteps;
      
      const timer = setInterval(() => {
        currentValue += increment;
        
        if ((increment > 0 && currentValue >= endValue) || 
            (increment < 0 && currentValue <= endValue)) {
          currentValue = endValue;
          clearInterval(timer);
        }
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: currentValue
        }));
      }, stepTime);
    });
  };
  
  // Renk koduna göre değer gösterge sınıfları
  const getHealthIndicatorColor = (normalizedValue) => {
    if (normalizedValue >= 0.8) return 'bg-red-500';
    if (normalizedValue >= 0.6) return 'bg-orange-500';
    if (normalizedValue >= 0.4) return 'bg-yellow-500';
    if (normalizedValue >= 0.2) return 'bg-green-500';
    return 'bg-blue-500';
  };

  // Renk değerlerini hesapla
  const getColorClasses = (color, isActive) => {
    const colorMap = {
      'red': {
        bg: isActive ? 'bg-red-100' : 'bg-red-50/80',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800/30',
        fill: 'bg-red-500'
      },
      'orange': {
        bg: isActive ? 'bg-orange-100' : 'bg-orange-50/80',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-800/30',
        fill: 'bg-orange-500'
      },
      'blue': {
        bg: isActive ? 'bg-blue-100' : 'bg-blue-50/80',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/30',
        fill: 'bg-blue-500'
      },
      'amber': {
        bg: isActive ? 'bg-amber-100' : 'bg-amber-50/80',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/30',
        fill: 'bg-amber-500'
      },
      'purple': {
        bg: isActive ? 'bg-purple-100' : 'bg-purple-50/80',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800/30',
        fill: 'bg-purple-500'
      },
      'gray': {
        bg: isActive ? 'bg-gray-100' : 'bg-gray-50/80',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-800/30',
        fill: 'bg-gray-500'
      }
    };
    
    const defaultClasses = {
      bg: isActive ? 'bg-gray-100' : 'bg-gray-50/80',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-700/30',
      fill: 'bg-gray-500'
    };
    
    return colorMap[color] || defaultClasses;
  };

  return (
    <div ref={sectionRef} className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Hava Kalitesi
      </h2>
      
      <div className={`
        bg-white/40 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden 
        border border-white/20 dark:border-white/10
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}>
        <div className="p-5">
          {/* Üst bölüm - AQI Değeri */}
          <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-6">
            <div className="mb-4 md:mb-0 flex items-center">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold
                transition-all duration-500 ${currentAqiLevel.color}
                ${isVisible ? 'scale-100' : 'scale-0'}
              `}>
                {Math.round(animatedValues.aqi || 0)}
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-semibold ${currentAqiLevel.textColor}`}>{currentAqiLevel.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hava Kalitesi İndeksi</p>
              </div>
            </div>
            
            <div className="flex-1 text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p>{currentAqiLevel.description}</p>
            </div>
          </div>
          
          {/* AQI Scale */}
          <div className="w-full mb-6">
            <div className="text-xs mb-1 flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">0</span>
              <span className="text-gray-600 dark:text-gray-400">500</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden">
              {aqiLevels.map((level, idx) => (
                <div 
                  key={level.level}
                  className={`
                    h-full flex-1 ${level.color} 
                    ${level.level === demoAqi.aqi ? 'ring-2 ring-white dark:ring-gray-700 relative z-10' : ''}
                    transition-all duration-300 ease-out
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                ></div>
              ))}
            </div>
            <div className="text-xs mt-1 flex justify-between">
              <span className="text-green-600 dark:text-green-400">İyi</span>
              <span className="text-purple-600 dark:text-purple-400">Tehlikeli</span>
            </div>
          </div>

          {/* Kirletici parametreleri */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Hava Kirleticileri</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pollutants.map((pollutant, idx) => {
                const isActive = activeParam === pollutant.id;
                const colorClasses = getColorClasses(pollutant.color, isActive);
                const animatedValue = animatedValues[pollutant.id] || 0;
                
                // Animasyon gecikme süresi
                const delay = isVisible ? `${idx * 100}ms` : '0ms';
                
                return (
                  <div
                    key={pollutant.id}
                    className={`
                      ${colorClasses.bg} dark:bg-gray-800/50
                      border ${colorClasses.border}
                      rounded-lg p-3 
                      cursor-pointer
                      transition-all duration-300
                      ${isActive ? 'shadow-md' : 'shadow-sm hover:shadow'}
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}
                    style={{ transitionDelay: delay }}
                    onMouseEnter={() => setActiveParam(pollutant.id)}
                    onMouseLeave={() => setActiveParam(null)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-medium ${colorClasses.text}`}>{pollutant.name}</span>
                      <span className="font-bold text-gray-800 dark:text-white">
                        {animatedValue.toFixed(1)} <span className="text-xs text-gray-500 dark:text-gray-400">{pollutant.unit}</span>
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getHealthIndicatorColor(pollutant.normalizedValue)}`}
                        style={{ 
                          width: isVisible ? `${Math.min(animatedValue / pollutant.limit * 100, 100)}%` : '0%',
                          transitionDelay: `${delay + 300}ms`
                        }}
                      ></div>
                    </div>
                    
                    {/* Hover tooltip */}
                    {isActive && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-white/70 dark:bg-gray-700/70 p-1.5 rounded">
                        <p>{pollutant.description}</p>
                        <p className="mt-1 text-red-600 dark:text-red-400">{pollutant.healthEffect}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirQuality;
