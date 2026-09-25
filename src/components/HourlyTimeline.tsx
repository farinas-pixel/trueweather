/**
 * TRUEWEATHER Hourly Forecast & Interactive Atmosphere Timeline
 * SVG Temperature Trend Chart + Horizontally Scrollable Cards.
 * Scrubbing or clicking an hour updates the 3D visual atmosphere in real time.
 */

import React, { useRef } from 'react';
import { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemp } from '../services/transformer';
import { Clock, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';

interface HourlyTimelineProps {
  hourly: HourlyForecastItem[];
  tempUnit: TemperatureUnit;
  selectedHourIndex: number | null;
  onSelectHour: (index: number | null) => void;
}

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({
  hourly,
  tempUnit,
  selectedHourIndex,
  onSelectHour,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';

  // Calculate min & max temp for SVG curve
  const temps = hourly.map((h) => convertTemp(h.temperature, tempUnit));
  const minTemp = Math.min(...temps, 0);
  const maxTemp = Math.max(...temps, 30);
  const tempRange = Math.max(1, maxTemp - minTemp);

  // SVG Chart points
  const chartWidth = Math.max(800, hourly.length * 70);
  const chartHeight = 60;
  const paddingX = 35;
  const paddingY = 12;

  const points = hourly.map((item, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / Math.max(1, hourly.length - 1);
    const converted = convertTemp(item.temperature, tempUnit);
    const normalized = (converted - minTemp) / tempRange;
    const y = chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
    return { x, y, temp: converted };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} ${chartHeight} L ${points[0]?.x || 0} ${chartHeight} Z`;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const accessibleSummary = hourly.length > 0
    ? `24-hour temperature ranges from ${Math.min(...temps)}${tempUnitSymbol} to ${Math.max(...temps)}${tempUnitSymbol}. Click an hour to preview atmospheric conditions.`
    : 'Hourly forecast unavailable.';

  return (
    <section className="mt-8" aria-labelledby="hourly-forecast-heading">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h2
            id="hourly-forecast-heading"
            className="text-xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <Clock size={20} className="text-cyan-400" aria-hidden="true" />
            <span>24-Hour Forecast & Atmosphere Timeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any hour to project that hour’s atmospheric parameters into the 3D sky.
          </p>
        </div>

        {/* Scroll Controls for Desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          {selectedHourIndex !== null && (
            <button
              type="button"
              onClick={() => onSelectHour(null)}
              className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 bg-cyan-950/40 border border-cyan-800/60 rounded-md transition-colors mr-2"
            >
              Reset to Current
            </button>
          )}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Scroll hourly forecast backward"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Scroll hourly forecast forward"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Screen-reader accessible alternative description */}
      <p className="sr-only">{accessibleSummary}</p>

      {/* Horizontally Scrollable Timeline Strip */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-4 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto custom-scrollbar pb-2"
          tabIndex={0}
          role="region"
          aria-label="24-hour timeline cards"
        >
          {/* Temperature Trend SVG Chart Overlay */}
          <div className="relative mb-2 pointer-events-none" style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}>
            <svg
              width={chartWidth}
              height={chartHeight}
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#tempGradient)" />
              <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={selectedHourIndex === idx ? 4.5 : 2.5}
                  className={selectedHourIndex === idx ? 'fill-cyan-300 stroke-cyan-900 stroke-2' : 'fill-cyan-400'}
                />
              ))}
            </svg>
          </div>

          {/* Hourly Column Cards */}
          <div className="flex items-center gap-2" style={{ minWidth: `${chartWidth}px` }}>
            {hourly.map((item, idx) => {
              const isSelected = selectedHourIndex === idx;
              const convertedTemp = convertTemp(item.temperature, tempUnit);

              return (
                <button
                  key={`${item.isoTime}-${idx}`}
                  type="button"
                  onClick={() => onSelectHour(isSelected ? null : idx)}
                  className={`flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all w-[70px] shrink-0 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${item.time}: ${convertedTemp}${tempUnitSymbol}, ${item.condition.label}, Rain probability ${item.precipitationProbability}%`}
                >
                  <span className="text-xs font-mono text-slate-400">{item.time}</span>

                  <div className="my-2">
                    <WeatherIcon
                      name={item.condition.iconName}
                      size={24}
                      accessibleLabel={item.condition.label}
                    />
                  </div>

                  <span className="text-sm font-mono font-bold text-white tabular-nums">
                    {convertedTemp}{tempUnitSymbol}
                  </span>

                  <div className="mt-2 flex items-center gap-0.5 text-[10px] text-cyan-300">
                    <Droplets size={10} aria-hidden="true" />
                    <span>{item.precipitationProbability}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
