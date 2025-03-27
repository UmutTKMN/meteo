/**
 * Güvenlik yardımcı fonksiyonları
 * Bu dosya veri doğrulama, input temizleme ve güvenlik kontrollerini içerir
 */

/**
 * Kullanıcı girdisini temizler ve güvenli hale getirir
 * @param {string} input - Temizlenecek kullanıcı girdisi
 * @returns {string} - Temizlenmiş ve güvenli hale getirilmiş girdi
 */
export function sanitizeInput(input) {
  if (!input) return "";

  // Temel girdi temizleme - HTML etiketlerini ve tehlikeli karakterleri kaldırır
  const sanitized = String(input)
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return sanitized;
}

/**
 * URL parametrelerini güvenli bir şekilde kodlama
 * @param {string} param - URL'de kullanılacak parametre değeri
 * @returns {string} - Güvenli bir şekilde kodlanmış parametre
 */
export function encodeURLParam(param) {
  return encodeURIComponent(String(param).trim());
}

/**
 * API anahtarının geçerli formatında olup olmadığını kontrol etme
 * @param {string} apiKey - Kontrol edilecek API anahtarı
 * @returns {boolean} - API anahtarının geçerli olup olmadığı
 */
export function isValidAPIKey(apiKey) {
  if (!apiKey || typeof apiKey !== "string") return false;

  // OpenWeatherMap API anahtarları genellikle 32 karakterli alfanümerik değerlerdir
  return /^[a-zA-Z0-9]{32}$/.test(apiKey);
}

/**
 * Koordinat değerlerinin geçerli olup olmadığını kontrol eder
 * @param {number} lat - Enlem değeri
 * @param {number} lon - Boylam değeri
 * @returns {boolean} - Koordinatların geçerli olup olmadığı
 */
export function isValidCoordinates(lat, lon) {
  // Enlem: -90 ile 90 arasında
  // Boylam: -180 ile 180 arasında
  return (
    !isNaN(lat) &&
    !isNaN(lon) &&
    parseFloat(lat) >= -90 &&
    parseFloat(lat) <= 90 &&
    parseFloat(lon) >= -180 &&
    parseFloat(lon) <= 180
  );
}

/**
 * Hata mesajlarını güvenli bir şekilde gösterme (hassas bilgileri gizler)
 * @param {Error} error - Oluşan hata
 * @returns {string} - Kullanıcıya gösterilecek güvenli hata mesajı
 */
export function getSafeErrorMessage(error) {
  if (!error) return "Bilinmeyen bir hata oluştu";

  // API anahtarını içeren hata mesajlarını temizle
  const message = error.message || "Bilinmeyen bir hata oluştu";

  // API key içeren hatalar için genel mesaj göster
  if (
    message.includes("API key") ||
    message.includes("apikey") ||
    message.includes("api_key")
  ) {
    return "API kimlik doğrulama hatası. Lütfen yapılandırmanızı kontrol edin.";
  }

  return message;
}

/**
 * localStorage kullanımı için güvenli bir yardımcı
 */
export const safeStorage = {
  /**
   * localStorage'dan güvenli bir şekilde veri alma
   * @param {string} key - Veri anahtarı
   * @param {any} defaultValue - Varsayılan değer
   * @returns {any} - Depolanan veri veya varsayılan değer
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Storage get error for key ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * localStorage'a güvenli bir şekilde veri kaydetme
   * @param {string} key - Veri anahtarı
   * @param {any} value - Kaydedilecek değer
   * @returns {boolean} - İşlemin başarılı olup olmadığı
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error);
      return false;
    }
  },

  /**
   * localStorage'dan güvenli bir şekilde veri silme
   * @param {string} key - Silinecek veri anahtarı
   * @returns {boolean} - İşlemin başarılı olup olmadığı
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Storage remove error for key ${key}:`, error);
      return false;
    }
  },
};
