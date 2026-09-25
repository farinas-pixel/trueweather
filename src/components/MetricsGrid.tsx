/**
 * TRUEWEATHER Metric Cards Grid
 * Displays individual meteorological sensor dimensions with tabular figures.
 */

import React from 'react';
import { CurrentWeather, SunData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { convertTemp, convertWind, formatWindDirection } from '../services/transformer';
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  CloudRain,
  Cloud,
  Sun,
  Sunrise,
  Sunset,
  ShieldAlert,
} from 'lucide-react';

interface MetricsGridProps {
  weather: CurrentWeather;
  sun: SunData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  uvIndexMax?: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  weather,
  sun,
  tempUnit,
  windUnit,
  uvIndexMax = 0,
}) => {
  const displayFeelsLike = convertTemp(weather.apparentTemperature, tempUnit);
  const displayWind = convertWind(weather.windSpeed, windUnit);
  const displayGusts = convertWind(weather.windGusts, windUnit);
  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';
  const windUnitSymbol = windUnit === 'kmh' ? 'km/h' : 'mph';

  const cards = [
    {
      id: 'feels-like',
      label: 'Apparent Temp',
      value: `${displayFeelsLike}${tempUnitSymbol}`,
      unit: '',
      subtext: 'Thermal perception based on humidity and air movement',
      icon: <Thermometer size={18} className="text-rose-400" aria-hidden="true" />,
    },
    {
      id: 'humidity',
      label: 'Relative Humidity',
      value: `${Math.round(weather.relativeHumidity)}`,
      unit: '%',
      subtext: 'Atmospheric moisture relative to saturation capacity',
      icon: <Droplets size={18} className="text-sky-400" aria-hidden="true" />,
    },
    {
      id: 'wind-speed',
      label: 'Sustained Wind',
      value: `${displayWind}`,
      unit: windUnitSymbol,
      subtext: `Direction: ${formatWindDirection(weather.windDirection)} (${weather.windDirection}°)`,
      icon: <Wind size={18} className="text-teal-400" aria-hidden="true" />,
    },
    {
      id: 'wind-gusts',
      label: 'Wind Gusts',
      value: `${displayGusts}`,
      unit: windUnitSymbol,
      subtext: 'Peak momentary air velocity observed at 10m height',
      icon: <Compass size={18} className="text-cyan-400" aria-hidden="true" />,
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      value: `${weather.precipitation.toFixed(1)}`,
      unit: 'mm',
      subtext: weather.rain > 0 ? `Active rainfall: ${weather.rain.toFixed(1)} mm` : 'No active rainfall measured',
      icon: <CloudRain size={18} className="text-blue-400" aria-hidden="true" />,
    },
    {
      id: 'cloud-cover',
      label: 'Cloud Cover',
      value: `${Math.round(weather.cloudCover)}`,
      unit: '%',
      subtext: 'Total sky dome fraction obscured by clouds',
      icon: <Cloud size={18} className="text-slate-300" aria-hidden="true" />,
    },
    {
      id: 'uv-index',
      label: 'UV Index Max',
      value: `${uvIndexMax.toFixed(1)}`,
      unit: '',
      subtext: uvIndexMax >= 8 ? 'Very high risk: sun protection required' : 'Standard solar radiation intensity',
      icon: <ShieldAlert size={18} className="text-amber-400" aria-hidden="true" />,
    },
    {
      id: 'sun-cycle',
      label: 'Solar Transit',
      value: `${sun.daylightDuration}`,
      unit: 'daylight',
      subtext: `Rise: ${sun.sunrise} · Set: ${sun.sunset}`,
      icon: <Sun size={18} className="text-amber-300" aria-hidden="true" />,
    },
  ];

  return (
    <section className="mt-8" aria-labelledby="weather-metrics-heading">
      <div className="mb-4">
        <h2 id="weather-metrics-heading" className="text-xl font-bold tracking-tight text-white">
          Atmospheric Dimensions
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Standardized sensor variables recorded via Open-Meteo REST endpoint.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700/80"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{card.label}</span>
              <div className="p-1 rounded-md bg-slate-800/80">{card.icon}</div>
            </div>

            <div className="my-1">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                {card.value}
              </span>
              {card.unit && (
                <span className="text-sm font-sans text-slate-400 ml-1">
                  {card.unit}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-tight">
              {card.subtext}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
