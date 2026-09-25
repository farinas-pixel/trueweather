/**
 * TRUEWEATHER Current Weather Card
 * Visual focal point displaying primary conditions, temperature, and metadata.
 */

import React from 'react';
import { CurrentWeather, LocationData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemp, convertWind, formatWindDirection } from '../services/transformer';
import { Star, RefreshCw, MapPin, Clock, Compass, Droplets, Wind, CloudRain, Cloud } from 'lucide-react';

interface CurrentWeatherCardProps {
  location: LocationData;
  weather: CurrentWeather;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  retrievedAt: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  weather,
  tempUnit,
  windUnit,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  isRefreshing,
  retrievedAt,
}) => {
  const displayTemp = convertTemp(weather.temperature, tempUnit);
  const displayFeelsLike = convertTemp(weather.apparentTemperature, tempUnit);
  const displayWind = convertWind(weather.windSpeed, windUnit);
  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';
  const windUnitSymbol = windUnit === 'kmh' ? 'km/h' : 'mph';

  const locationSubtitle = [location.admin1, location.country].filter(Boolean).join(', ');

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/85 backdrop-blur-md p-6 sm:p-8 shadow-2xl transition-all"
      aria-labelledby="current-weather-heading"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
            <MapPin size={14} className="text-cyan-400 shrink-0" aria-hidden="true" />
            <span>{location.timezone}</span>
            <span aria-hidden="true">·</span>
            <span>{weather.isDay ? 'Daytime' : 'Night'}</span>
          </div>

          <h2
            id="current-weather-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <span>{location.name}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">{locationSubtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorite locations'}
            aria-label={isFavorite ? 'Remove location from favorites' : 'Save location to favorites'}
            aria-pressed={isFavorite}
          >
            <Star
              size={18}
              className={isFavorite ? 'fill-amber-400 text-amber-400' : ''}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white disabled:opacity-50 transition-all"
            title="Refresh live weather data"
            aria-label="Refresh live weather data"
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? 'animate-spin text-cyan-400' : ''}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Main Temperature and Condition Focal Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
        {/* Left: Giant Temperature & Condition */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/40 shrink-0">
            <WeatherIcon
              name={weather.condition.iconName}
              size={56}
              accessibleLabel={weather.condition.label}
            />
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl sm:text-7xl font-bold font-mono tracking-tighter text-white tabular-nums">
                {displayTemp}
              </span>
              <span className="text-3xl sm:text-4xl font-light text-slate-400">
                {tempUnitSymbol}
              </span>
            </div>

            <p className="text-lg font-semibold text-slate-200 mt-1">
              {weather.condition.label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
              {weather.condition.description}
            </p>
          </div>
        </div>

        {/* Right: Primary Telemetry Specs */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" aria-hidden="true" />
              <span>Feels Like</span>
            </span>
            <span className="text-lg font-mono font-semibold text-white mt-1 tabular-nums">
              {displayFeelsLike}{tempUnitSymbol}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Droplets size={13} className="text-sky-400" aria-hidden="true" />
              <span>Humidity</span>
            </span>
            <span className="text-lg font-mono font-semibold text-white mt-1 tabular-nums">
              {Math.round(weather.relativeHumidity)}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Wind size={13} className="text-teal-400" aria-hidden="true" />
              <span>Wind</span>
            </span>
            <span className="text-lg font-mono font-semibold text-white mt-1 tabular-nums">
              {displayWind} {windUnitSymbol}
              <span className="text-xs text-slate-400 font-sans ml-1">
                {formatWindDirection(weather.windDirection)}
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <CloudRain size={13} className="text-cyan-400" aria-hidden="true" />
              <span>Precipitation</span>
            </span>
            <span className="text-lg font-mono font-semibold text-white mt-1 tabular-nums">
              {weather.precipitation.toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>

      {/* Footer Timestamp & Attribution */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Observed via Open-Meteo REST API</span>
          <span aria-hidden="true">·</span>
          <span>Updated at {retrievedAt}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 font-mono text-[11px]">
          <span>Cloud cover: {Math.round(weather.cloudCover)}%</span>
          <span aria-hidden="true">·</span>
          <span>Wind gusts: {convertWind(weather.windGusts, windUnit)} {windUnitSymbol}</span>
        </div>
      </div>
    </article>
  );
};
