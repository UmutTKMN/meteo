# Hava Durumu Uygulaması

Modern ve etkileşimli bir hava durumu uygulaması. Anlık ve tahminli hava durumu bilgilerini güzel bir arayüzle sunar.

![Hava Durumu Uygulaması](https://github.com/UmutTKMN/meteo/blob/main/public/meteo-example.png)

## Özellikler

- **Anlık Hava Durumu**: Seçilen konum için güncel hava durumu bilgileri
- **5 Günlük Tahmin**: Gelecek 5 gün için hava durumu tahminleri
- **Saatlik Tahminler**: 24 saatlik detaylı hava durumu tahminleri
- **Etkileşimli Sıcaklık Grafiği**: Sıcaklık değişimlerini görselleştiren grafik
- **Hava Kalitesi Bilgisi**: Seçilen konum için hava kalitesi verileri ve analizi
- **Konum Bazlı Hava Durumu**: Kullanıcının konumuna göre otomatik hava durumu bilgisi
- **Konum Haritası**: Seçilen lokasyonun hava durumu haritası
- **Favori Konumlar**: Sık kullanılan konumları kaydetme ve hızlıca erişim
- **Aktivite Önerileri**: Hava durumuna göre önerilen aktiviteler
- **Otomatik Yenileme**: Ayarlanabilir aralıklarla hava durumu verilerini güncelleme
- **Karanlık/Aydınlık Mod**: Kullanıcının tercihine göre arayüz teması
- **Hava Durumu Animasyonları**: Mevcut hava durumunu canlandıran animasyonlar
- **Duyarlı Tasarım**: Tüm ekran boyutlarına uyumlu arayüz

## Teknoloji Yığını

- **Frontend**: React, Vite
- **UI Kütüphanesi**: TailwindCSS
- **Harita**: Leaflet
- **API**: OpenWeatherMap
- **Grafikler**: Canvas API
- **Animasyonlar**: CSS & SVG
- **Veri Saklaması**: LocalStorage

## Proje Yapısı

```
src/
├── components/
│   ├── animations/
│   │   ├── WeatherAnimation.jsx
│   │   └── weatherAnimations.css
│   ├── charts/
│   │   └── TemperatureChart.jsx
│   ├── favorites/
│   │   └── FavoriteLocations.jsx
│   ├── layout/
│   │   ├── AutoRefresh.jsx
│   │   └── Header.jsx
│   ├── recommendations/
│   │   └── ActivityRecommendations.jsx
│   ├── ui/
│   │   ├── AlertBanner.jsx
│   │   ├── LocationPermission.jsx
│   │   ├── Notification.jsx
│   │   └── QuickActions.jsx
│   └── weather/
│       ├── AirQuality.jsx
│       ├── CurrentWeather.jsx
│       ├── ForecastWeather.jsx
│       ├── HourlyForecast.jsx
│       ├── WeatherDetails.jsx
│       └── WeatherMap.jsx
├── services/
│   └── weatherService.js
├── App.jsx
├── main.jsx
└── tailwind.css
```

## Kurulum

1. Projeyi klonlayın:

   ```bash
   git clone https://github.com/UmutTKMN/meteo.git
   cd meteo
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. `.env` dosyası oluşturun ve OpenWeatherMap API anahtarınızı ekleyin:

   ```
   VITE_WEATHER_API_KEY=sizin_api_anahtarınız
   ```

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Kullanım

### API Anahtarı Alma

Bu uygulama OpenWeatherMap API'sini kullanır. Ücretsiz bir API anahtarı almak için [OpenWeatherMap](https://openweathermap.org/api) adresine kayıt olun.

### Özelleştirme

- **API Anahtarı**: `services/weatherService.js` dosyasında API anahtarınızı güncelleyin
- **Varsayılan Şehir**: `App.jsx` içinde varsayılan şehri değiştirin
- **Renk Teması**: `tailwind.config.js` dosyasını özelleştirin
- **Yenileme Aralığı**: `App.jsx` içinde `AutoRefresh` bileşenindeki `interval` değerini ayarlayın

### Diğer Şehirler İçin Hava Durumu

Uygulama başlığındaki arama çubuğunu kullanarak istediğiniz şehrin hava durumunu arayabilirsiniz. Sık kullandığınız şehirleri favorilere ekleyerek hızlıca erişebilirsiniz.

### Konum İzni

Uygulamanın konumunuzu kullanmasına izin verirseniz, otomatik olarak bulunduğunuz yerin hava durumu bilgilerini gösterir.

## Katkıda Bulunma

1. Bu repo'yu fork'layın
2. Yeni özellik için bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Yeni özellik: Amazing Feature'`)
4. Branch'inizi push'layın (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## Lisans

MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## İletişim

Proje Link: [https://github.com/UmutTKMN/meteo]
