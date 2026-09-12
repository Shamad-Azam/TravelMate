"use client";

import { DestinationWeatherData, WeatherDailyForecast } from "@/lib/travel/types";

interface LiveWeatherWidgetProps {
  weather: DestinationWeatherData;
  locationName: string;
}

export default function LiveWeatherWidget({
  weather,
  locationName,
}: LiveWeatherWidgetProps) {
  const current = weather.current;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-4 sm:p-6 text-white shadow-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Real-Time Weather
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            {locationName}
          </h3>
          <p className="text-xs text-slate-300">
            {weather.elevation ? `Altitude: ${weather.elevation}m` : "Current Meteorological Conditions"}
          </p>
        </div>

        <div className="text-right">
          <span className="text-4xl">🌤️</span>
        </div>
      </div>

      {/* Main Temp & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-sm border border-white/10">
          <span className="text-[11px] text-slate-300 block">Temperature</span>
          <strong className="text-2xl sm:text-3xl font-black text-white">
            {current.temperature}°C
          </strong>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Feels like {current.apparentTemperature}°C
          </span>
        </div>

        <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-sm border border-white/10">
          <span className="text-[11px] text-slate-300 block">Conditions</span>
          <strong className="text-sm sm:text-base font-bold text-white block mt-1">
            {current.weatherDescription}
          </strong>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Precipitation: {current.precipitation} mm
          </span>
        </div>

        <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-sm border border-white/10">
          <span className="text-[11px] text-slate-300 block">Wind Speed</span>
          <strong className="text-xl sm:text-2xl font-black text-white">
            {current.windSpeed}
          </strong>
          <span className="text-[10px] text-slate-400 block mt-0.5">km/h mountain breeze</span>
        </div>

        <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-sm border border-white/10">
          <span className="text-[11px] text-slate-300 block">Humidity</span>
          <strong className="text-xl sm:text-2xl font-black text-white">
            {current.humidity}%
          </strong>
          <span className="text-[10px] text-slate-400 block mt-0.5">Relative humidity</span>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {weather.daily && weather.daily.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              7-Day Expedition Forecast
            </span>
            <span className="text-[10px] text-slate-400 sm:hidden">Swipe →</span>
          </div>
          <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-7 gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
            {weather.daily.map((day: WeatherDailyForecast, idx: number) => (
              <div
                key={idx}
                className="min-w-[95px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink bg-white/5 hover:bg-white/10 rounded-xl p-2.5 text-center border border-white/5 transition-colors"
              >
                <span className="text-[11px] font-bold text-slate-300 block">
                  {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
                <span className="text-xl my-1 block">⛅</span>
                <div className="text-xs font-bold text-white">
                  {day.maxTemp}° / <span className="text-slate-400">{day.minTemp}°</span>
                </div>
                <span className="text-[10px] text-teal-300 block mt-0.5">
                  💧 {day.precipitationProbability}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source attribution */}
      <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-slate-400">
        <span>🌐 Source: {weather.source}</span>
        <span>Updated: {new Date(weather.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}
