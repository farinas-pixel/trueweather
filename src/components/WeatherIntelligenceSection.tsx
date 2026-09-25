/**
 * TRUEWEATHER Weather Intelligence Section
 * Rule-derived analytical interpretations based directly on real API variables.
 * Clear boundaries: Not official meteorological warnings or AI hallucinated predictions.
 */

import React from 'react';
import { WeatherIntelligenceInsight } from '../types/weather';
import {
  Flame,
  ThermometerSun,
  Snowflake,
  Smile,
  CloudRain,
  CloudRainWind,
  Sun,
  Wind,
  Droplets,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface WeatherIntelligenceSectionProps {
  insights: WeatherIntelligenceInsight[];
  glanceList: string[];
}

export const WeatherIntelligenceSection: React.FC<WeatherIntelligenceSectionProps> = ({
  insights,
  glanceList,
}) => {
  const renderIcon = (name: string, severity: string) => {
    const colorClass =
      severity === 'caution'
        ? 'text-amber-400'
        : severity === 'advisory'
        ? 'text-cyan-400'
        : severity === 'positive'
        ? 'text-emerald-400'
        : 'text-slate-300';

    switch (name) {
      case 'Flame':
      case 'ThermometerSun':
        return <Flame size={18} className={colorClass} aria-hidden="true" />;
      case 'Snowflake':
        return <Snowflake size={18} className={colorClass} aria-hidden="true" />;
      case 'CloudRain':
      case 'CloudRainWind':
        return <CloudRain size={18} className={colorClass} aria-hidden="true" />;
      case 'Wind':
        return <Wind size={18} className={colorClass} aria-hidden="true" />;
      case 'Droplets':
        return <Droplets size={18} className={colorClass} aria-hidden="true" />;
      case 'CheckCircle2':
        return <CheckCircle2 size={18} className={colorClass} aria-hidden="true" />;
      case 'AlertCircle':
        return <AlertCircle size={18} className={colorClass} aria-hidden="true" />;
      case 'Clock':
        return <Clock size={18} className={colorClass} aria-hidden="true" />;
      default:
        return <Smile size={18} className={colorClass} aria-hidden="true" />;
    }
  };

  return (
    <section className="mt-8" aria-labelledby="weather-intelligence-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2
            id="weather-intelligence-heading"
            className="text-xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <Sparkles size={20} className="text-cyan-400" aria-hidden="true" />
            <span>Weather Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Application-derived interpretations computed strictly from verified Open-Meteo variables.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-lg self-start sm:self-auto">
          <Info size={13} className="text-slate-400 shrink-0" aria-hidden="true" />
          <span>Rule-based algorithmic derivation · Not official advisories</span>
        </div>
      </div>

      {/* Today At A Glance Strip */}
      {glanceList.length > 0 && (
        <div className="mb-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Today At A Glance
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-300">
            {glanceList.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid of Analytical Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => {
          const borderStyle =
            insight.severity === 'caution'
              ? 'border-amber-500/30 bg-amber-500/5'
              : insight.severity === 'advisory'
              ? 'border-cyan-500/30 bg-cyan-500/5'
              : insight.severity === 'positive'
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-slate-800 bg-slate-900/70';

          return (
            <div
              key={insight.id}
              className={`rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-slate-700 ${borderStyle}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0">
                  {renderIcon(insight.icon, insight.severity)}
                </div>
                <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{insight.observation}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
