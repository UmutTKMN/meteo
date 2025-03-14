// Çevre değişkenlerinden API bilgilerini al
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Fallback olarak demo key kullanılır
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;

export async function getCurrentWeather(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Weather data not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

export async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Weather data not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw error;
  }
}

export async function getForecast(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Forecast data not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

export async function getForecastByCoords(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Forecast data not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast by coordinates:", error);
    throw error;
  }
}
