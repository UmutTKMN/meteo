# 🌦️ Meteo - Modern Hava Durumu Uygulaması

<div align="center">
  <img src="https://github.com/UmutTKMN/meteo/blob/main/public/weather-icon.svg" alt="Meteo Uygulaması" width="150px">
</div>

## 📋 İçerik

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [API Kullanımı](#-api-kullanımı)
- [Hata Giderme](#-hata-giderme)
- [Lisans](#-lisans)

## 🌤️ Proje Hakkında

Meteo, modern ve kullanıcı dostu arayüzü ile hava durumu bilgilerini anlık olarak takip etmenizi sağlayan bir web uygulamasıdır. OpenWeatherMap API entegrasyonu sayesinde dünyanın herhangi bir yerindeki güncel hava durumu ve tahminlere erişebilirsiniz.

Canlı animasyonlar, detaylı grafikler ve interaktif harita özellikleriyle hava durumu deneyiminizi zenginleştirir.

## ✨ Özellikler

- **🔍 Şehir Bazlı Arama**: Dünyanın herhangi bir yerindeki hava durumu bilgilerine erişin
- **📍 Konum Bazlı Hava Durumu**: Tarayıcınızın konum servisini kullanarak bulunduğunuz yerin hava durumunu görüntüleyin
- **📊 Detaylı Tahminler**: Günlük ve saatlik hava tahminleri
- **📈 Sıcaklık Grafikleri**: Görsel sıcaklık değişim grafikleri
- **🗺️ İnteraktif Harita**: Harita üzerinde hava durumu görüntüleme
- **🌈 Hava Durumu Animasyonları**: Güncel hava durumuna göre değişen canlı animasyonlar
- **💨 Rüzgar, Nem ve Basınç Bilgileri**: Detaylı hava durumu parametreleri
- **🌡️ Hissedilen Sıcaklık**: Gerçek ve hissedilen sıcaklık değerleri
- **🏖️ Aktivite Önerileri**: Hava durumuna göre günlük aktivite önerileri
- **⭐ Favori Şehirler**: Sık kullandığınız şehirleri kaydetme özelliği
- **🔔 Hava Durumu Uyarıları**: Aşırı hava koşulları için uyarı sistemi

## 📸 Ekran Görüntüleri

<div align="center">
  <img src="https://github.com/UmutTKMN/meteo/blob/main/screenshots/ana-ekran.png" alt="Ana Ekran" width="600px">
  <p><em>Ana Ekran</em></p>
  
  <img src="https://github.com/UmutTKMN/meteo/blob/main/screenshots/haftal%C4%B1k.png" alt="Haftalık Tahmin" width="600px">
  <p><em>Haftalık Tahmin ve Grafikler</em></p>
  
  <img src="https://github.com/UmutTKMN/meteo/blob/main/screenshots/harita.png" alt="Hava Durumu Haritası" width="600px">
  <p><em>İnteraktif Hava Durumu Haritası</em></p>
</div>

## 🛠️ Teknolojiler

Bu projede aşağıdaki teknolojileri kullanıyoruz:

- **Frontend**:

  - [React 19](https://react.dev/) - Modern kullanıcı arayüzü geliştirme
  - [Vite](https://vitejs.dev/) - Hızlı geliştirme ortamı
  - [Tailwind CSS 4](https://tailwindcss.com/) - Stil ve tasarım
  - [Leaflet](https://leafletjs.com/) - İnteraktif haritalar

- **API**:
  - [OpenWeatherMap API](https://openweathermap.org/api) - Hava durumu verileri

## 🚀 Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edin:

### Ön Koşullar

- Node.js (16.x veya üzeri)
- pnpm (8.x veya üzeri)

### Adımlar

1. Projeyi klonlayın:

   ```bash
   git clone https://github.com/UmutTKMN/meteo.git
   cd meteo
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   pnpm install
   ```

3. `.env.example` dosyasını `.env` olarak kopyalayın:

   ```bash
   cp .env.example .env
   ```

4. `.env` dosyasını açın ve OpenWeatherMap API anahtarınızı ekleyin:

   ```
   VITE_WEATHER_API_KEY=sizin_api_anahtarınız
   ```

   > 📝 **Not**: API anahtarını [OpenWeatherMap](https://openweathermap.org/api) web sitesinden ücretsiz olarak alabilirsiniz.

5. Uygulamayı başlatın:

   ```bash
   pnpm dev
   ```

6. Tarayıcınızda şu adresi açın: `http://localhost:5173`

## 🔑 API Kullanımı

Bu uygulama, hava durumu verilerini çekmek için OpenWeatherMap API'sini kullanır. API kullanımıyla ilgili aşağıdaki noktalara dikkat edin:

- Ücretsiz API planı dakikada 60 istek ile sınırlıdır
- Ücretsiz API planı ile 5 günlük/3 saatlik tahmin verisi alabilirsiniz
- API anahtarınızı güvenli bir şekilde saklayın ve halka açık depolarda paylaşmayın

## 🔧 Hata Giderme

Sık karşılaşılan sorunlar ve çözümleri:

### API Bağlantı Hataları

- API anahtarınızın doğru olduğundan emin olun
- Internet bağlantınızı kontrol edin
- API kullanım limitinizi aşmadığınızdan emin olun

### Konum Hataları

- Tarayıcınızda konum servislerine izin verdiğinizden emin olun
- HTTPS kullanmak, konum servislerinin daha güvenilir çalışmasını sağlar

### Görüntüleme Sorunları

- En son tarayıcı sürümünü kullandığınızdan emin olun
- Tarayıcı önbelleğini temizlemeyi deneyin

## 📄 Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır. Detaylı bilgi için lisans dosyasını inceleyebilirsiniz.

---

<div align="center">
  <p>❤️ ile geliştirildi</p>
  <p>
    <a href="https://github.com/kahrastudio">GitHub</a> •
    <a href="https://twitter.com/kahrastudio">Twitter</a>
  </p>
</div>
