import { useState, useEffect } from 'react';

function ActivityRecommendations({ weatherData }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!weatherData) return;
    
    const temp = weatherData.main.temp;
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const currentHour = new Date().getHours();
    const isDayTime = currentHour >= 6 && currentHour < 20;
    
    let newRecommendations = [];
    
    // Sıcaklığa göre öneriler
    if (temp >= 30) {
      newRecommendations.push({
        type: 'warning',
        text: 'Hava çok sıcak! Bol su için ve mümkünse dışarı çıkmayın.',
        icon: '🥵'
      });
      newRecommendations.push({
        type: 'activity',
        text: 'Serinlemek için havuza gidebilir veya klimalı iç mekanlarda vakit geçirebilirsiniz.',
        icon: '🏊‍♀️'
      });
    } else if (temp >= 25) {
      newRecommendations.push({
        type: 'activity',
        text: 'Güneş kremi sürmeyi unutmayın! Piknik veya sahil aktiviteleri için güzel bir gün.',
        icon: '🧴'
      });
    } else if (temp >= 15) {
      newRecommendations.push({
        type: 'activity',
        text: 'Dışarıda yürüyüş veya bisiklet sürüş için ideal bir hava.',
        icon: '🚲'
      });
    } else if (temp >= 5) {
      newRecommendations.push({
        type: 'activity',
        text: 'Hafif bir mont giyin. Açık hava kafeleri veya parklar için iyi bir gün.',
        icon: '🧥'
      });
    } else if (temp > 0) {
      newRecommendations.push({
        type: 'warning',
        text: 'Hava soğuk! Kalın giyinin.',
        icon: '🧣'
      });
    } else {
      newRecommendations.push({
        type: 'warning',
        text: 'Dondurucu soğuk! Mümkünse dışarı çıkmaktan kaçının.',
        icon: '❄️'
      });
      newRecommendations.push({
        type: 'activity',
        text: 'Sıcak içecekler, kitap okumak ve evde film izlemek için ideal bir gün.',
        icon: '☕'
      });
    }
    
    // Hava durumuna göre öneriler
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      newRecommendations.push({
        type: 'warning',
        text: 'Yağmur var! Şemsiye veya yağmurluk almayı unutmayın.',
        icon: '☂️'
      });
      newRecommendations.push({
        type: 'activity',
        text: 'Müze ziyareti veya alışveriş merkezi gibi kapalı mekan aktiviteleri tercih edin.',
        icon: '🏛️'
      });
    } else if (weatherMain.includes('thunderstorm')) {
      newRecommendations.push({
        type: 'warning',
        text: 'Gök gürültülü fırtına! Mümkünse dışarı çıkmayın ve elektronik cihazları prizden çekin.',
        icon: '⛈️'
      });
    } else if (weatherMain.includes('snow')) {
      newRecommendations.push({
        type: 'warning',
        text: 'Kar yağışı var! Kaygan zeminlere dikkat edin.',
        icon: '⚠️'
      });
      if (temp < 0) {
        newRecommendations.push({
          type: 'activity',
          text: 'Kayak veya kızak gibi kış sporları için uygun bir gün.',
          icon: '🎿'
        });
      }
    } else if (weatherMain.includes('fog') || weatherMain.includes('mist')) {
      newRecommendations.push({
        type: 'warning',
        text: 'Sisli hava! Araç kullanırken dikkatli olun.',
        icon: '🌫️'
      });
    } else if (weatherMain.includes('clear') && isDayTime) {
      newRecommendations.push({
        type: 'activity',
        text: 'Güneşli bir gün! Doğa yürüyüşleri, piknik veya plaj aktiviteleri için harika.',
        icon: '☀️'
      });
    }
    
    // Rüzgâr durumuna göre öneriler
    if (windSpeed > 10) {
      newRecommendations.push({
        type: 'warning',
        text: 'Güçlü rüzgâr! Uçan nesnelere dikkat edin.',
        icon: '💨'
      });
    }
    
    // Nem durumuna göre öneriler
    if (humidity > 80 && temp > 25) {
      newRecommendations.push({
        type: 'warning',
        text: 'Yüksek nem! Bunaltıcı sıcaklık hissedilebilir, bol sıvı tüketin.',
        icon: '💧'
      });
    }
    
    setRecommendations(newRecommendations);
  }, [weatherData]);
  
  if (!weatherData || recommendations.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Bugün İçin Öneriler</h2>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {recommendations.map((recommendation, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl backdrop-blur-md flex items-start gap-3 shadow-md
              ${recommendation.type === 'warning' 
                ? 'bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50' 
                : 'bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50'}`
            }
          >
            <div className="text-2xl">{recommendation.icon}</div>
            <div className="flex-1">
              <p className={`
                ${recommendation.type === 'warning' 
                  ? 'text-amber-800 dark:text-amber-200' 
                  : 'text-blue-800 dark:text-blue-200'}`
                }
              >
                {recommendation.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityRecommendations;
