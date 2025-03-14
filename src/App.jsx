import { useState, useEffect, useCallback } from "react";
import Header from "./components/layout/Header";
import CurrentWeather from "./components/weather/CurrentWeather";
import WeatherDetails from "./components/weather/WeatherDetails";
import ForecastWeather from "./components/weather/ForecastWeather";
import HourlyForecast from "./components/weather/HourlyForecast";
import FavoriteLocations from "./components/favorites/FavoriteLocations";
import AirQuality from "./components/weather/AirQuality";
import WeatherMap from "./components/weather/WeatherMap";
import WeatherAnimation from "./components/animations/WeatherAnimation";
import TemperatureChart from "./components/charts/TemperatureChart";
import ActivityRecommendations from "./components/recommendations/ActivityRecommendations";
import AutoRefresh from "./components/layout/AutoRefresh";
import Notification from "./components/ui/Notification";
import AlertBanner from "./components/ui/AlertBanner";
import LocationPermission from "./components/ui/LocationPermission";
import QuickActions from "./components/ui/QuickActions";
import {
  getCurrentWeather,
  getForecast,
  getWeatherByCoords,
  getForecastByCoords,
} from "./services/weatherService";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState("");
  const [notification, setNotification] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [locationRequested, setLocationRequested] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null); // null: unknown, true: granted, false: denied

  // Verileri yenileme fonksiyonu
  const refreshWeatherData = useCallback(async () => {
    if (!currentCity) return;

    try {
      setLoading(true);
      const weather = await getCurrentWeather(currentCity);
      const forecast = await getForecast(currentCity);
      setWeatherData(weather);
      setForecastData(forecast);
      setNotification({
        message: "Hava durumu bilgileri güncellendi",
        type: "success",
        duration: 3000,
      });
      checkForWeatherAlerts(weather, forecast);
    } catch (err) {
      console.error("Hava durumu güncellenirken hata oluştu:", err);
      setNotification({
        message: "Hava durumu güncellenemedi",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [currentCity]);

  // Konum izni isteği
  const requestLocationPermission = useCallback(() => {
    setLocationRequested(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocationPermission(true);
          try {
            setLoading(true);
            const { latitude, longitude } = position.coords;
            const weather = await getWeatherByCoords(latitude, longitude);
            const forecast = await getForecastByCoords(latitude, longitude);
            setWeatherData(weather);
            setForecastData(forecast);
            setCurrentCity(weather.name);
            setError(null);

            // Olası hava durumu uyarılarını kontrol et
            checkForWeatherAlerts(weather, forecast);
          } catch (err) {
            console.error("Konum bazlı hava durumu alınırken hata:", err);
            setError(
              "Konumunuz için hava durumu bilgisi alınamadı. Lütfen bir şehir arayın."
            );
            fetchDefaultWeather();
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
          setLocationPermission(false);
          fetchDefaultWeather();
        }
      );
    } else {
      setLocationPermission(false);
      fetchDefaultWeather();
    }
  }, []);

  useEffect(() => {
    // İlk yüklemede konum izinlerini kontrol etme
    const checkLocationPermission = async () => {
      if (navigator.geolocation && navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });

          if (permission.state === "granted") {
            setLocationPermission(true);
            requestLocationPermission();
          } else if (permission.state === "prompt") {
            setLocationPermission(null); // İzin henüz sorulmadı
          } else {
            setLocationPermission(false);
            fetchDefaultWeather();
          }
        } catch (error) {
          console.log("Permission check error:", error);
          fetchDefaultWeather();
        }
      } else {
        fetchDefaultWeather();
      }
    };

    checkLocationPermission();
  }, [requestLocationPermission]);

  const fetchDefaultWeather = async () => {
    try {
      setLoading(true);
      const weather = await getCurrentWeather("Istanbul");
      const forecast = await getForecast("Istanbul");
      setWeatherData(weather);
      setForecastData(forecast);
      setCurrentCity("Istanbul");
      setError(null);

      // Olası hava durumu uyarılarını kontrol et
      checkForWeatherAlerts(weather, forecast);
    } catch (err) {
      console.error("Varsayılan hava durumu alınırken hata:", err);
      setError(
        "Hava durumu bilgisi alınamadı. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city) => {
    if (!city) return;

    setLoading(true);
    try {
      const weather = await getCurrentWeather(city);
      const forecast = await getForecast(city);
      setWeatherData(weather);
      setForecastData(forecast);
      setCurrentCity(city);
      setError(null);

      // Olası hava durumu uyarılarını kontrol et
      checkForWeatherAlerts(weather, forecast);
    } catch (err) {
      console.error("Şehir ararken hata:", err);
      setError(
        `"${city}" için hava durumu bilgisi bulunamadı. Lütfen şehir adını kontrol edip tekrar deneyin.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Hava durumu verilerine göre olası uyarıları kontrol et
  const checkForWeatherAlerts = (weather, forecast) => {
    const alerts = [];

    // Aşırı sıcaklık kontrolü
    if (weather.main.temp >= 35) {
      alerts.push({
        title: "Aşırı Sıcaklık Uyarısı",
        description:
          "Sıcaklık 35°C ve üzerinde. Lütfen doğrudan güneş ışığından kaçının ve bol su için.",
        severity: "extreme",
      });
    }
    // Aşırı soğukluk kontrolü
    else if (weather.main.temp <= -10) {
      alerts.push({
        title: "Aşırı Soğuk Uyarısı",
        description:
          "Sıcaklık -10°C ve altında. Lütfen dış mekan aktivitelerinden kaçının.",
        severity: "extreme",
      });
    }

    // Şiddetli rüzgar kontrolü
    if (weather.wind.speed > 15) {
      alerts.push({
        title: "Kuvvetli Rüzgar Uyarısı",
        description:
          "Rüzgar hızı saatte 50 km üzerinde. Açık alanlarda dikkatli olun.",
        severity: "severe",
      });
    }

    // Yağış kontrolü - forecast'taki ilk birkaç saate bakarak
    const nextFewHours = forecast?.list?.slice(0, 3) || [];
    const heavyRain = nextFewHours.some(
      (item) => item.rain && (item.rain["3h"] > 10 || item.rain["1h"] > 5)
    );

    if (heavyRain) {
      alerts.push({
        title: "Yoğun Yağış Uyarısı",
        description:
          "Önümüzdeki saatlerde şiddetli yağış bekleniyor. Sel riski olabilir.",
        severity: "moderate",
      });
    }

    // Gök gürültülü fırtına kontrolü
    const hasThunderstorm = nextFewHours.some((item) =>
      item.weather.some((w) => w.main.toLowerCase().includes("thunderstorm"))
    );

    if (hasThunderstorm) {
      alerts.push({
        title: "Gök Gürültülü Fırtına Uyarısı",
        description:
          "Yakın saatlerde gök gürültülü fırtına bekleniyor. Mümkünse dışarı çıkmayın.",
        severity: "severe",
      });
    }

    setWeatherAlerts(alerts);
  };

  // Hava durumu bilgilerini paylaşma fonksiyonu
  const handleShareWeather = () => {
    if (!weatherData) return;

    const shareText = `${weatherData.name}'da hava durumu: ${Math.round(
      weatherData.main.temp
    )}°C, ${weatherData.weather[0].description} | Hava Durumu Uygulaması`;

    if (navigator.share) {
      navigator
        .share({
          title: "Hava Durumu",
          text: shareText,
          url: window.location.href,
        })
        .then(() => {
          setNotification({
            message: "Hava durumu bilgisi paylaşıldı",
            type: "success",
            duration: 3000,
          });
        })
        .catch((error) => {
          console.error("Paylaşım hatası:", error);
        });
    } else {
      // Tarayıcı paylaşım API'sini desteklemiyorsa
      try {
        navigator.clipboard.writeText(shareText);
        setNotification({
          message: "Hava durumu bilgisi panoya kopyalandı",
          type: "info",
          duration: 3000,
        });
      } catch (err) {
        console.error("Panoya kopyalama hatası:", err);
      }
    }
  };

  // Mevcut konumu favorilere ekleme
  const handleAddToFavorites = () => {
    if (!currentCity) return;

    const storedFavorites = localStorage.getItem("favoriteLocations");
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (!favorites.includes(currentCity)) {
      favorites.push(currentCity);
      localStorage.setItem("favoriteLocations", JSON.stringify(favorites));
      setNotification({
        message: `${currentCity} favorilere eklendi`,
        type: "success",
        duration: 3000,
      });
    } else {
      setNotification({
        message: `${currentCity} zaten favorilerinizde`,
        type: "info",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}

      {weatherAlerts.length > 0 && <AlertBanner alerts={weatherAlerts} />}

      <Header onSearch={handleSearch} currentCity={currentCity} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        ) : null}

        {!locationRequested && locationPermission === null && (
          <LocationPermission onRequestLocation={requestLocationPermission} />
        )}

        <div className="mb-6">
          <FavoriteLocations onSelectLocation={handleSearch} />
          <AutoRefresh onRefresh={refreshWeatherData} interval={600000} />{" "}
          {/* 10 dakikada bir yenile */}
        </div>

        <div className="relative">
          {weatherData && (
            <WeatherAnimation weatherType={weatherData.weather[0].main} />
          )}
          <CurrentWeather weatherData={weatherData} isLoading={loading} />
        </div>

        <WeatherDetails weatherData={weatherData} />
        <HourlyForecast forecastData={forecastData} />
        <TemperatureChart forecastData={forecastData} />
        <ActivityRecommendations weatherData={weatherData} />
        <ForecastWeather forecastData={forecastData} />
        <AirQuality />

        {weatherData && (
          <WeatherMap 
            lat={weatherData.coord.lat} 
            lon={weatherData.coord.lon}
            weatherData={weatherData}
          />
        )}
      </main>

      <QuickActions
        onShareWeather={handleShareWeather}
        onAddToFavorites={handleAddToFavorites}
        onRefresh={refreshWeatherData}
      />

      <footer className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm p-4 mt-8">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Hava Durumu Uygulaması | OpenWeatherMap
            API ile geliştirilmiştir
          </p>
          <p className="mt-1 text-xs">
            Tüm hava durumu verileri sadece bilgi amaçlıdır ve doğruluğu garanti
            edilmez.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
