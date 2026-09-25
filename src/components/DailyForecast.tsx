/**
 * TRUEWEATHER 7-Day Forecast Component
 * Comprehensive multi-day outlook driven directly by Open-Meteo daily endpoint.
 */

import React from 'react';
import { DailyForecastItem, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemp } from '../services/transformer';
import { CalendarDays, Droplets, Sun } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  tempUnit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, tempUnit }) => {
  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';

  // Overall min and max across all 7 days for proportional bar rendering
  const allMins = daily.map((d) => convertTemp(d.minTemp, tempUnit));
  const allMaxs = daily.map((d) => convertTemp(d.maxTemp, tempUnit));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = Math.max(1, globalMax - globalMin);

  return (
    <section className="mt-8" aria-labelledby="daily-forecast-heading">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            id="daily-forecast-heading"
            className="text-xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <CalendarDays size={20} className="text-cyan-400" aria-hidden="true" />
            <span>7-Day Synoptic Forecast</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily temperature envelopes, precipitation probability, and weather codes.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm divide-y divide-slate-800/80 overflow-hidden shadow-xl">
        {daily.map((day) => {
          const min = convertTemp(day.minTemp, tempUnit);
          const max = convertTemp(day.maxTemp, tempUnit);

          // Bar offset math
          const leftPercent = Math.max(0, ((min - globalMin) / range) * 100);
          const widthPercent = Math.max(8, ((max - min) / range) * 100);

          return (
            <div
              key={day.date}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
            >
              {/* Day & Date info */}
              <div className="w-32 shrink-0">
                <span className="text-sm font-semibold text-white block">{day.dayName}</span>
                <span className="text-xs text-slate-400 font-mono">{day.formattedDate}</span>
              </div>

              {/* Weather icon & condition name */}
              <div className="flex items-center gap-3 sm:w-56 shrink-0">
                <div className="p-1.5 rounded-lg bg-slate-800/60 shrink-0">
                  <WeatherIcon
                    name={day.condition.iconName}
                    size={20}
                    accessibleLabel={day.condition.label}
                  />
                </div>
                <div className="truncate">
                  <span className="text-xs font-medium text-slate-200 block truncate">
                    {day.condition.label}
                  </span>
                  {day.precipitationProbability > 0 && (
                    <span className="text-[11px] text-cyan-300 flex items-center gap-1 mt-0.5">
                      <Droplets size={10} aria-hidden="true" />
                      <span>{day.precipitationProbability}% rain chance</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Temperature Range Bar */}
              <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-mono font-medium text-slate-400 w-10 text-right tabular-nums">
                  {min}{tempUnitSymbol}
                </span>

                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden relative" aria-hidden="true">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-teal-300 to-amber-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-mono font-bold text-white w-10 tabular-nums">
                  {max}{tempUnitSymbol}
                </span>
              </div>

              {/* Sun & UV metadata */}
              <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400 w-44 justify-end">
                <span>UV {day.uvIndexMax.toFixed(0)}</span>
                <span aria-hidden="true">·</span>
                <span>{day.sunrise} - {day.sunset}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
