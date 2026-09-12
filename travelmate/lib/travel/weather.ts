import { DestinationWeatherData, WeatherCurrent, WeatherDailyForecast } from "./types";

const WMO_WEATHER_CODES: Record<number, string> = {
  0: "Clear sky ☀️",
  1: "Mainly clear 🌤️",
  2: "Partly cloudy ⛅",
  3: "Overcast ☁️",
  45: "Fog 🌫️",
  48: "Depositing rime fog 🌫️",
  51: "Light drizzle 🌦️",
  53: "Moderate drizzle 🌦️",
  55: "Dense drizzle 🌧️",
  61: "Slight rain 🌧️",
  63: "Moderate rain 🌧️",
  65: "Heavy rain ⛈️",
  71: "Slight snow fall 🌨️",
  73: "Moderate snow fall 🌨️",
  75: "Heavy snow fall ❄️",
  77: "Snow grains ❄️",
  80: "Slight rain showers 🌦️",
  81: "Moderate rain showers 🌧️",
  82: "Violent rain showers ⛈️",
  85: "Slight snow showers 🌨️",
  86: "Heavy snow showers ❄️",
  95: "Thunderstorm ⚡",
  96: "Thunderstorm with slight hail ⛈️",
  99: "Thunderstorm with heavy hail ⛈️",
};

export function getWeatherDescription(code: number): string {
  return WMO_WEATHER_CODES[code] || "Variable conditions 🌤️";
}

// In-memory short cache (15 minutes) to respect rate limits and reduce upstream calls
const weatherCache = new Map<string, { data: DestinationWeatherData; expiresAt: number }>();

/**
 * Fetches real current weather and 7-day forecast from Open-Meteo API.
 * Free, real-time, high-precision global elevation and atmospheric data.
 */
export async function getDestinationWeather(
  destinationName: string,
  latitude: number,
  longitude: number
): Promise<DestinationWeatherData> {
  const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const response = await fetch(url, {
      next: { revalidate: 900 }, // 15 mins Next.js cache
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const json = await response.json();

    const currentRaw = json.current || {};
    const dailyRaw = json.daily || {};

    const current: WeatherCurrent = {
      temperature: Math.round(currentRaw.temperature_2m ?? 0),
      apparentTemperature: Math.round(currentRaw.apparent_temperature ?? 0),
      precipitation: currentRaw.precipitation ?? 0,
      windSpeed: Math.round(currentRaw.wind_speed_10m ?? 0),
      weatherCode: currentRaw.weather_code ?? 0,
      weatherDescription: getWeatherDescription(currentRaw.weather_code ?? 0),
      humidity: Math.round(currentRaw.relative_humidity_2m ?? 0),
      elevation: json.elevation ? Math.round(json.elevation) : undefined,
      timestamp: currentRaw.time || new Date().toISOString(),
    };

    const daily: WeatherDailyForecast[] = [];
    const dates: string[] = dailyRaw.time || [];
    for (let i = 0; i < Math.min(dates.length, 7); i++) {
      const code = dailyRaw.weather_code?.[i] ?? 0;
      daily.push({
        date: dates[i],
        minTemp: Math.round(dailyRaw.temperature_2m_min?.[i] ?? 0),
        maxTemp: Math.round(dailyRaw.temperature_2m_max?.[i] ?? 0),
        precipitationProbability: dailyRaw.precipitation_probability_max?.[i] ?? 0,
        weatherCode: code,
        weatherDescription: getWeatherDescription(code),
      });
    }

    const weatherData: DestinationWeatherData = {
      destination: destinationName,
      latitude,
      longitude,
      current,
      daily,
      elevation: json.elevation ? Math.round(json.elevation) : undefined,
      updatedAt: new Date().toISOString(),
      source: "Open-Meteo Global Meteorological API",
    };

    weatherCache.set(cacheKey, { data: weatherData, expiresAt: Date.now() + 15 * 60 * 1000 });
    return weatherData;
  } catch (error) {
    console.error("[Weather Service] Open-Meteo fetch failed:", error);
    throw new Error("LIVE_WEATHER_UNAVAILABLE");
  }
}
