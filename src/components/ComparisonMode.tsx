/**
 * TRUEWEATHER Location Comparison View
 * Fetches and compares real weather data across up to 3 global locations side-by-side.
 */

import React, { useState } from 'react';
import { LocationData, NormalizedWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { fetchWeatherData, searchLocations } from '../services/api';
import { convertTemp, convertWind, normalizeWeatherData } from '../services/transformer';
import { WeatherIcon } from './WeatherIcon';
import { Plus, X, Search, Loader2, Sparkles, Scale, RefreshCw } from 'lucide-react';

interface ComparisonModeProps {
  currentData: NormalizedWeatherData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const ComparisonMode: React.FC<ComparisonModeProps> = ({
  currentData,
  tempUnit,
  windUnit,
}) => {
  const [comparedCities, setComparedCities] = useState<NormalizedWeatherData[]>([currentData]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tempUnitSymbol = tempUnit === 'celsius' ? '°C' : '°F';
  const windUnitSymbol = windUnit === 'kmh' ? 'km/h' : 'mph';

  const handleSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    try {
      const results = await searchLocations(searchQuery.trim());
      setSearchResults(results);
    } catch (err: any) {
      setErrorMessage(err.message || 'Location not found.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddLocation = async (loc: LocationData) => {
    if (comparedCities.some((c) => c.location.id === loc.id)) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    if (comparedCities.length >= 3) {
      setErrorMessage('You can compare a maximum of 3 locations simultaneously.');
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    try {
      const { rawData, responseTimeMs } = await fetchWeatherData(
        loc.latitude,
        loc.longitude,
        loc.timezone
      );
      const normalized = normalizeWeatherData(rawData, loc, responseTimeMs);
      setComparedCities((prev) => [...prev, normalized]);
      setSearchResults([]);
      setSearchQuery('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to fetch weather for selected location.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemoveCity = (id: number) => {
    setComparedCities((prev) => prev.filter((c) => c.location.id !== id));
  };

  const handleLoadPreset = async (presetCities: string[]) => {
    setIsSearching(true);
    setErrorMessage(null);
    try {
      const loaded: NormalizedWeatherData[] = [];
      for (const name of presetCities) {
        const [loc] = await searchLocations(name);
        if (loc) {
          const { rawData, responseTimeMs } = await fetchWeatherData(
            loc.latitude,
            loc.longitude,
            loc.timezone
          );
          loaded.push(normalizeWeatherData(rawData, loc, responseTimeMs));
        }
      }
      setComparedCities(loaded);
    } catch (err: any) {
      setErrorMessage('Failed to load comparison preset.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="mt-8" aria-labelledby="comparison-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            id="comparison-heading"
            className="text-xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <Scale size={20} className="text-cyan-400" aria-hidden="true" />
            <span>Multi-Location Comparison</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query and benchmark up to 3 verified meteorological locations side by side.
          </p>
        </div>

        {/* Preset Quick Loader */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Quick presets:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset(['Chennai', 'London', 'Tokyo'])}
            disabled={isSearching}
            className="px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors disabled:opacity-50"
          >
            Chennai / London / Tokyo
          </button>
        </div>
      </div>

      {/* Add New Location Search Form */}
      {comparedCities.length < 3 && (
        <div className="mb-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <form onSubmit={handleSearchCity} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a city to add to comparison (e.g. Dubai, Paris)..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors shrink-0"
            >
              {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              <span>Add City</span>
            </button>
          </form>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-3 divide-y divide-slate-800 bg-slate-950 border border-slate-800 rounded-lg max-h-40 overflow-y-auto">
              {searchResults.map((loc) => (
                <button
                  key={`${loc.latitude}-${loc.longitude}-${loc.id}`}
                  type="button"
                  onClick={() => handleAddLocation(loc)}
                  className="w-full text-left p-2.5 hover:bg-slate-800/60 flex items-center justify-between text-xs text-white"
                >
                  <span className="font-medium">
                    {loc.name}, {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-400 mt-2">{errorMessage}</p>
          )}
        </div>
      )}

      {/* Side-by-side Comparative Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, comparedCities.length)} gap-4`}>
        {comparedCities.map((item) => {
          const current = item.current;
          const displayTemp = convertTemp(current.temperature, tempUnit);
          const displayFeels = convertTemp(current.apparentTemperature, tempUnit);
          const displayWind = convertWind(current.windSpeed, windUnit);

          return (
            <div
              key={item.location.id}
              className="relative flex flex-col justify-between bg-slate-900/85 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {item.location.name}
                  </h3>
                  <span className="text-xs text-slate-400 block">
                    {[item.location.admin1, item.location.country].filter(Boolean).join(', ')}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400/80 block mt-0.5">
                    {item.location.timezone}
                  </span>
                </div>

                {comparedCities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(item.location.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800"
                    aria-label={`Remove ${item.location.name} from comparison`}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Weather Focal Visual */}
              <div className="flex items-center gap-4 py-3 border-y border-slate-800/80 my-2">
                <WeatherIcon
                  name={current.condition.iconName}
                  size={36}
                  accessibleLabel={current.condition.label}
                />
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-mono font-bold text-white tabular-nums">
                      {displayTemp}
                    </span>
                    <span className="text-base text-slate-400">{tempUnitSymbol}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-300">
                    {current.condition.label}
                  </span>
                </div>
              </div>

              {/* Comparative Dimensions Table */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Feels Like</span>
                  <span className="font-mono text-white font-medium">
                    {displayFeels}{tempUnitSymbol}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Relative Humidity</span>
                  <span className="font-mono text-white font-medium">
                    {Math.round(current.relativeHumidity)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Wind Velocity</span>
                  <span className="font-mono text-white font-medium">
                    {displayWind} {windUnitSymbol}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cloud Fraction</span>
                  <span className="font-mono text-white font-medium">
                    {Math.round(current.cloudCover)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rain Prob Today</span>
                  <span className="font-mono text-white font-medium">
                    {item.daily[0]?.precipitationProbability || 0}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
