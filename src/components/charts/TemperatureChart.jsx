import { useRef, useEffect, useState } from 'react';

function TemperatureChart({ forecastData }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
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

  // Veri yükleme animasyonu için
  useEffect(() => {
    if (isVisible && forecastData) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, forecastData]);
  
  useEffect(() => {
    if (!forecastData || !forecastData.list || !chartRef.current) return;
    
    // Canvas boyutlarını ayarla
    const updateChartSize = () => {
      if (chartRef.current) {
        const canvas = chartRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        setChartSize({ width: canvas.width, height: canvas.height });
      }
    };

    updateChartSize();
    window.addEventListener('resize', updateChartSize);
    
    return () => {
      window.removeEventListener('resize', updateChartSize);
    };
  }, [forecastData]);
  
  useEffect(() => {
    if (!forecastData || !forecastData.list || !chartRef.current || chartSize.width === 0 || !isLoaded) return;
    
    const ctx = chartRef.current.getContext('2d');
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Stil değişkenleri
    const textColor = isDarkMode ? 'rgba(229, 229, 229, 0.9)' : 'rgba(51, 51, 51, 0.9)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)';
    const accentColor = isDarkMode ? '#3b82f6' : '#2563eb'; // blue-500 veya blue-600
    const shadowColor = isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)';
    
    // Ölçeklendirme faktörü
    const dpr = window.devicePixelRatio;
    ctx.scale(dpr, dpr);
    
    // İlk 8 veriyi (24 saat) al
    const data = forecastData.list.slice(0, 8);
    
    // Grafik boyutları
    const width = chartSize.width / dpr;
    const height = chartSize.height / dpr;
    const padding = { top: 30, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Canvas temizle
    ctx.clearRect(0, 0, width, height);
    
    // Sıcaklık verilerini topla
    const temperatures = data.map(item => Math.round(item.main.temp));
    const minTemp = Math.min(...temperatures) - 2;
    const maxTemp = Math.max(...temperatures) + 2;
    const tempRange = maxTemp - minTemp;
    
    // Zaman verilerini formatla
    const times = data.map(item => {
      const date = new Date(item.dt * 1000);
      return date.getHours() + ':00';
    });

    // Koordinat hesaplama yardımcı fonksiyonları
    const getX = (index) => padding.left + (chartWidth / (data.length - 1)) * index;
    const getY = (temp) => padding.top + chartHeight - ((temp - minTemp) / tempRange) * chartHeight;
    
    // Yatay ızgaralar (gölgelendirme ile)
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Sıcaklık aralığına göre renk geçişi oluştur
    const getGradientColors = () => {
      const avgTemp = (maxTemp + minTemp) / 2;
      
      if (avgTemp > 30) return { start: '#ef4444', end: '#f97316' }; // red to orange
      if (avgTemp > 20) return { start: '#f97316', end: '#eab308' }; // orange to yellow
      if (avgTemp > 10) return { start: '#22c55e', end: '#0ea5e9' }; // green to sky
      if (avgTemp > 0) return { start: '#0ea5e9', end: '#6366f1' };  // sky to indigo
      return { start: '#6366f1', end: '#8b5cf6' };                   // indigo to purple
    };
    
    const gradientColors = getGradientColors();
    
    // Alan dolgusu ekle (gradient)
    const fillGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    fillGradient.addColorStop(0, isDarkMode ? `${gradientColors.start}80` : `${gradientColors.start}40`);
    fillGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    // Alan dolgu çizimi - Animasyonlu
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(minTemp)); // Alt sol
    
    const animProgress = isLoaded ? 1 : 0;
    for (let i = 0; i <= data.length - 1; i++) {
      const x = getX(i);
      const y = isLoaded ? getY(temperatures[i]) : getY(minTemp);
      
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        const prevX = getX(i - 1);
        const prevY = isLoaded ? getY(temperatures[i - 1]) : getY(minTemp);
        const cpX1 = prevX + (x - prevX) / 3;
        const cpX2 = prevX + 2 * (x - prevX) / 3;
        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
      }
    }
    
    ctx.lineTo(getX(data.length - 1), getY(minTemp)); // Alt sağ
    ctx.closePath();
    ctx.fillStyle = fillGradient;
    ctx.fill();
    
    // Sıcaklık eksenini yaz
    ctx.font = 'bold 12px Inter, system-ui, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= 4; i++) {
      const temp = maxTemp - ((maxTemp - minTemp) / 4) * i;
      const y = padding.top + (chartHeight / 4) * i;
      ctx.fillText(`${Math.round(temp)}°`, padding.left - 10, y);
    }
    
    // Zaman eksenini yaz
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '12px Inter, system-ui, sans-serif';
    
    times.forEach((time, i) => {
      const x = getX(i);
      ctx.fillText(time, x, height - padding.bottom + 12);
    });
    
    // Çizgi için gradient
    const lineGradient = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0);
    lineGradient.addColorStop(0, gradientColors.start);
    lineGradient.addColorStop(1, gradientColors.end);
    
    // Sıcaklık çizgisini çiz
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = getX(i);
      const y = isLoaded ? getY(temperatures[i]) : getY(minTemp);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Smooth curve
        const prevX = getX(i - 1);
        const prevY = isLoaded ? getY(temperatures[i - 1]) : getY(minTemp);
        const cpX1 = prevX + (x - prevX) / 3;
        const cpX2 = prevX + 2 * (x - prevX) / 3;
        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
      }
    }
    
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Çizgiye gölge ekle
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    
    // Sıcaklık noktaları
    temperatures.forEach((temp, i) => {
      const x = getX(i);
      const y = isLoaded ? getY(temp) : getY(minTemp);
      
      // Aktif index için daha belirgin nokta çiz
      const isActive = i === activeIndex;
      const pointColor = getTemperatureColor(temp);
      
      // Sadece yüklendiyse çiz
      if (isLoaded) {
        // Gölge efekti
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowColor = 'transparent';
        
        // İç nokta
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = pointColor;
        ctx.fill();
        
        // Aktif nokta için vurgu halkası
        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.strokeStyle = pointColor;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Değer balonu
          const bubbleWidth = 60;
          const bubbleHeight = 28;
          const bubbleY = y - 26;
          
          // Balon arka planı
          ctx.beginPath();
          drawRoundedRect(ctx, x - bubbleWidth/2, bubbleY - bubbleHeight/2, bubbleWidth, bubbleHeight, 12);
          ctx.fillStyle = isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
          ctx.fill();
          ctx.strokeStyle = pointColor;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Değer metni
          ctx.font = 'bold 13px Inter, system-ui, sans-serif';
          ctx.fillStyle = isDarkMode ? '#e5e5e5' : '#333333';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${temp}°C`, x, bubbleY);
        }
      }
    });
    
  }, [forecastData, chartSize, activeIndex, isLoaded, isVisible]);
  
  // Sıcaklığa göre renk belirle
  const getTemperatureColor = (temp) => {
    if (temp > 35) return '#dc2626'; // red-600
    if (temp > 30) return '#ea580c'; // orange-600
    if (temp > 25) return '#d97706'; // amber-600
    if (temp > 20) return '#65a30d'; // lime-600
    if (temp > 15) return '#16a34a'; // green-600
    if (temp > 10) return '#0891b2'; // cyan-600
    if (temp > 5)  return '#0284c7'; // sky-600
    if (temp > 0)  return '#2563eb'; // blue-600
    if (temp > -5) return '#4f46e5'; // indigo-600
    return '#7c3aed'; // violet-600
  };
  
  // Yuvarlatılmış dikdörtgen çizme yardımcı fonksiyonu
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };
  
  const handleMouseMove = (e) => {
    if (!chartRef.current || !forecastData || !forecastData.list || !isLoaded) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Veri noktası sayısı
    const pointCount = 8;
    
    // Her bir nokta arasındaki mesafe
    const pointWidth = width / (pointCount - 1);
    
    // Hangi noktaya yakın olduğunu bul
    const pointIndex = Math.round(x / pointWidth);
    
    // Geçerli bir index ise aktif et
    if (pointIndex >= 0 && pointIndex < pointCount) {
      setActiveIndex(pointIndex);
    } else {
      setActiveIndex(null);
    }
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Ortalama sıcaklığı hesapla ve stil belirle
  const getBackgroundStyle = () => {
    if (!forecastData || !forecastData.list) return {};
    
    const temps = forecastData.list.slice(0, 8).map(item => item.main.temp);
    const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
    
    let bgClass = '';
    if (avgTemp > 30) bgClass = 'from-red-400/10 to-orange-300/10 dark:from-red-800/20 dark:to-orange-700/20';
    else if (avgTemp > 25) bgClass = 'from-orange-400/10 to-yellow-300/10 dark:from-orange-800/20 dark:to-yellow-700/20';
    else if (avgTemp > 20) bgClass = 'from-yellow-400/10 to-green-300/10 dark:from-yellow-800/20 dark:to-green-700/20';
    else if (avgTemp > 15) bgClass = 'from-green-400/10 to-teal-300/10 dark:from-green-800/20 dark:to-teal-700/20';
    else if (avgTemp > 10) bgClass = 'from-teal-400/10 to-blue-300/10 dark:from-teal-800/20 dark:to-blue-700/20';
    else if (avgTemp > 0) bgClass = 'from-blue-400/10 to-indigo-300/10 dark:from-blue-800/20 dark:to-indigo-700/20';
    else bgClass = 'from-indigo-400/10 to-purple-300/10 dark:from-indigo-800/20 dark:to-purple-700/20';
    
    return {
      className: `bg-gradient-to-br ${bgClass}`
    };
  };
  
  const bgStyle = getBackgroundStyle();

  return (
    <div 
      ref={containerRef}
      className={`
        mt-6 bg-white/40 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/10 dark:border-white/5
        transition-all duration-700 ease-out
        ${bgStyle.className} 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        24 Saatlik Sıcaklık Grafiği
      </h2>
      <div className="relative w-full h-64">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <canvas 
          ref={chartRef} 
          className="w-full h-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            touchAction: 'none',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-out'
          }}
        ></canvas>
      </div>
    </div>
  );
}

export default TemperatureChart;
