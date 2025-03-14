import { useEffect, useRef } from 'react';
import './weatherAnimations.css';

function WeatherAnimation({ weatherType }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Mevcut animasyon elementlerini temizle
    containerRef.current.innerHTML = '';
    
    // Hava durumuna göre animasyon oluştur
    switch(weatherType.toLowerCase()) {
      case 'clear':
        createSunnyAnimation();
        break;
      case 'clouds':
        createCloudyAnimation();
        break;
      case 'rain':
      case 'drizzle':
        createRainAnimation();
        break;
      case 'snow':
        createSnowAnimation();
        break;
      case 'thunderstorm':
        createThunderstormAnimation();
        break;
      default:
        createCloudyAnimation();
    }
  }, [weatherType]);

  const createSunnyAnimation = () => {
    const sun = document.createElement('div');
    sun.className = 'sun';
    containerRef.current.appendChild(sun);
    
    // Güneş ışınları
    for (let i = 0; i < 8; i++) {
      const ray = document.createElement('div');
      ray.className = 'sun-ray';
      ray.style.transform = `rotate(${i * 45}deg)`;
      ray.style.animationDelay = `${i * 0.2}s`;
      containerRef.current.appendChild(ray);
    }
  };

  const createCloudyAnimation = () => {
    const cloudsCount = 5;
    
    for (let i = 0; i < cloudsCount; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      
      // Bulutları farklı boyutlarda ve pozisyonlarda oluştur
      const size = 0.5 + Math.random() * 0.5; // 0.5-1 arası
      const left = Math.random() * 100; // 0-100% arası
      const animationDuration = 70 + Math.random() * 30; // 70-100s arası
      
      cloud.style.transform = `scale(${size})`;
      cloud.style.left = `${left}%`;
      cloud.style.animationDuration = `${animationDuration}s`;
      cloud.style.animationDelay = `${i * -5}s`;
      
      containerRef.current.appendChild(cloud);
    }
  };

  const createRainAnimation = () => {
    createCloudyAnimation();
    
    const dropsCount = 50;
    
    for (let i = 0; i < dropsCount; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      
      // Yağmur damlalarını farklı pozisyonlarda oluştur
      const left = Math.random() * 100;
      const animationDuration = 0.5 + Math.random(); // 0.5-1.5s arası
      const animationDelay = Math.random() * 2; // 0-2s arası
      
      drop.style.left = `${left}%`;
      drop.style.animationDuration = `${animationDuration}s`;
      drop.style.animationDelay = `${animationDelay}s`;
      
      containerRef.current.appendChild(drop);
    }
  };

  const createSnowAnimation = () => {
    createCloudyAnimation();
    
    const flakesCount = 40;
    
    for (let i = 0; i < flakesCount; i++) {
      const flake = document.createElement('div');
      flake.className = 'snow-flake';
      
      // Kar tanelerini farklı boyutlarda ve pozisyonlarda oluştur
      const size = 3 + Math.random() * 7; // 3-10px arası
      const left = Math.random() * 100;
      const animationDuration = 5 + Math.random() * 10; // 5-15s arası
      const animationDelay = Math.random() * 5; // 0-5s arası
      
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.left = `${left}%`;
      flake.style.animationDuration = `${animationDuration}s`;
      flake.style.animationDelay = `${animationDelay}s`;
      
      containerRef.current.appendChild(flake);
    }
  };

  const createThunderstormAnimation = () => {
    createRainAnimation();
    
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    containerRef.current.appendChild(lightning);
  };

  return (
    <div 
      ref={containerRef}
      className="weather-animation-container"
      aria-hidden="true"
    ></div>
  );
}

export default WeatherAnimation;
