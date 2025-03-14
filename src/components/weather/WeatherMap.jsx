import { useRef, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

function WeatherMap({ lat, lon, weatherData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Leaflet'i dinamik olarak yükle
  useEffect(() => {
    if (!lat || !lon || !isVisible) return;

    const loadLeaflet = async () => {
      try {
        // Leaflet'i dinamik olarak import et
        const L = await import('leaflet').then(module => module.default || module);
        
        // Harita zaten yüklendiyse, yeniden oluşturmaya gerek yok
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lon], 12);
          
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lon]);
          }
          return;
        }
        
        // Haritayı oluştur
        const map = L.map(mapRef.current, {
          center: [lat, lon],
          zoom: 12,
          zoomControl: false,
          attributionControl: true,
          scrollWheelZoom: false
        });
        
        // Tile layer ekle (OpenStreetMap veya başka bir harita sağlayıcısı)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Yakınlaştırma kontrollerini sağ üst köşeye ekle
        L.control.zoom({
          position: 'topright'
        }).addTo(map);
        
        // Özel bir işaretçi ikonu oluştur
        const weatherIcon = L.divIcon({
          html: `
            <div class="w-10 h-10 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              ${weatherData ? Math.round(weatherData.main.temp) + '°C' : ''}
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        
        // İşaretçiyi ekle
        const marker = L.marker([lat, lon], { icon: weatherIcon }).addTo(map);
        
        if (weatherData) {
          // Hava durumu bilgisi içeren popup ekle
          marker.bindPopup(`
            <div class="text-center">
              <div class="font-bold">${weatherData.name}</div>
              <div>${weatherData.weather[0].description}</div>
              <div>${Math.round(weatherData.main.temp)}°C</div>
            </div>
          `);
        }
        
        // Referansları sakla
        mapInstanceRef.current = map;
        markerRef.current = marker;
        
        // Haritanın doğru şekilde render olması için
        setTimeout(() => {
          map.invalidateSize();
          setIsMapLoaded(true);
        }, 300);
        
        // Hava durumu katmanı ekle (sadece görsel bir efekt olarak)
        if (weatherData) {
          const weatherCondition = weatherData.weather[0].main.toLowerCase();
          
          // Hava durumuna göre farklı overlay ekle
          if (weatherCondition.includes('rain')) {
            addRainOverlay(map, L);
          } else if (weatherCondition.includes('cloud')) {
            addCloudOverlay(map, L);
          } else if (weatherCondition.includes('snow')) {
            addSnowOverlay(map, L);
          }
        }
        
      } catch (error) {
        console.error("Harita yüklenirken bir hata oluştu:", error);
      }
    };
    
    loadLeaflet();
    
    return () => {
      // Component unmount olduğunda haritayı temizle
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [lat, lon, isVisible, weatherData]);

  // Hava durumu katmanları için yardımcı fonksiyonlar
  const addRainOverlay = (map, L) => {
    const bounds = map.getBounds().pad(0.1);
    const overlay = L.rectangle(bounds, {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.15,
      weight: 0
    }).addTo(map);
    
    // Yağmur animasyonu için CSS filtresi
    if (mapRef.current) {
      mapRef.current.style.filter = 'drop-shadow(0px 0px 2px rgba(59, 130, 246, 0.4))';
    }
  };
  
  const addCloudOverlay = (map, L) => {
    const bounds = map.getBounds().pad(0.1);
    const overlay = L.rectangle(bounds, {
      color: '#94a3b8',
      fillColor: '#94a3b8',
      fillOpacity: 0.1,
      weight: 0
    }).addTo(map);
    
    if (mapRef.current) {
      mapRef.current.style.filter = 'brightness(0.95)';
    }
  };
  
  const addSnowOverlay = (map, L) => {
    const bounds = map.getBounds().pad(0.1);
    const overlay = L.rectangle(bounds, {
      color: '#e2e8f0',
      fillColor: '#e2e8f0',
      fillOpacity: 0.15,
      weight: 0
    }).addTo(map);
    
    if (mapRef.current) {
      mapRef.current.style.filter = 'brightness(1.05) contrast(0.95)';
    }
  };

  if (!lat || !lon) return null;

  return (
    <div 
      ref={containerRef}
      className={`
        mt-6 bg-white/40 dark:bg-gray-800/30 backdrop-blur-md rounded-xl overflow-hidden shadow-lg 
        border border-white/10 dark:border-white/5
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white px-5 pt-5 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Hava Durumu Haritası
      </h2>
      
      <div className="relative w-full h-64 md:h-80">
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-full z-10"
          style={{ 
            opacity: isMapLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-out'
          }}
        ></div>
        
        {/* Harita altında konumu gösteren bir bilgi satırı */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent py-2 px-4">
          <div className="text-xs text-white drop-shadow flex justify-between items-center">
            <span className="font-medium">
              Konum: {lat.toFixed(4)}, {lon.toFixed(4)}
            </span>
            <span>
              {weatherData ? weatherData.name + ', ' + weatherData.sys.country : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Konum bilgisi ve başka şehirleri inceleme önerisi */}
      <div className="px-5 py-3 text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center">
        <span>
          Harita verileri © OpenStreetMap contributors
        </span>
        <button 
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([lat, lon], 13, {
                duration: 1.5,
                animate: true
              });
            }
          }}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Merkeze Dön
        </button>
      </div>
    </div>
  );
}

export default WeatherMap;
