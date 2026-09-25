/**
 * TRUEWEATHER Search Hero Component
 * City search, location disambiguation, recent searches, and real-time triggers.
 */

import React, { useState } from 'react';
import { LocationData } from '../types/weather';
import { Search, MapPin, Navigation, Loader2, X, History } from 'lucide-react';

interface SearchHeroProps {
  onSearch: (city: string) => void;
  onSelectLocation: (loc: LocationData) => void;
  isLoading: boolean;
  ambiguousLocations: LocationData[];
  onDismissAmbiguous: () => void;
  recentSearches: LocationData[];
  onClearRecent: () => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  onSearch,
  onSelectLocation,
  isLoading,
  ambiguousLocations,
  onDismissAmbiguous,
  recentSearches,
  onClearRecent,
  onUseCurrentLocation,
  isLocating,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim());
  };

  const handleExampleClick = (cityName: string) => {
    setQuery(cityName);
    onSearch(cityName);
  };

  return (
    <section className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Editorial Headline */}
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3 text-balance">
        Weather, understood.
      </h1>
      <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 text-balance font-normal">
        Live conditions, forecasts, and weather intelligence powered by real Open-Meteo REST APIs.
      </p>

      {/* Main Search Form */}
      <form
        onSubmit={handleSubmit}
        className="relative max-w-2xl mx-auto mb-5"
        role="search"
      >
        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-xl shadow-slate-950/40 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all p-1.5">
          <label htmlFor="city-search-input" className="sr-only">
            Search city or place name
          </label>

          <div className="pl-3.5 pr-2 text-slate-400 shrink-0" aria-hidden="true">
            <Search size={20} />
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or place (e.g. Chennai, London, Tokyo)..."
            disabled={isLoading || isLocating}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none py-2 px-1 disabled:opacity-50"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors mr-1"
              aria-label="Clear search input"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}

          {/* Current Location GPS Button */}
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLoading || isLocating}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors mr-1.5 disabled:opacity-50"
            title="Use current GPS location"
          >
            {isLocating ? (
              <Loader2 size={14} className="animate-spin text-cyan-400" aria-hidden="true" />
            ) : (
              <Navigation size={14} className="text-cyan-400" aria-hidden="true" />
            )}
            <span>Locate</span>
          </button>

          {/* Search Submit Button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading || isLocating}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-semibold text-sm rounded-lg shadow transition-all shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Searching</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Location Quick Examples */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-6">
        <span className="font-medium text-slate-400">Try searching:</span>
        {['Chennai', 'Bengaluru', 'Mumbai', 'London', 'Tokyo', 'New York'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleExampleClick(city)}
            className="text-slate-300 hover:text-cyan-300 hover:underline transition-colors px-1 py-0.5"
          >
            {city}
          </button>
        ))}
      </div>

      {/* Multiple Location Disambiguation Dialog */}
      {ambiguousLocations.length > 0 && (
        <div className="max-w-xl mx-auto mb-6 bg-slate-900 border border-cyan-500/40 rounded-xl p-4 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Multiple Locations Found</h2>
              <p className="text-xs text-slate-400">Select the intended destination to fetch weather:</p>
            </div>
            <button
              type="button"
              onClick={onDismissAmbiguous}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              aria-label="Close location selector"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 mt-2 max-h-56 overflow-y-auto custom-scrollbar">
            {ambiguousLocations.map((loc) => (
              <button
                key={`${loc.latitude}-${loc.longitude}-${loc.id}`}
                type="button"
                onClick={() => onSelectLocation(loc)}
                className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800/70 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-cyan-400 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-medium text-white group-hover:text-cyan-300">
                      {loc.name}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches Row */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
            <History size={13} aria-hidden="true" />
            <span>Recent:</span>
          </span>
          {recentSearches.map((loc) => (
            <button
              key={`${loc.name}-${loc.id}`}
              type="button"
              onClick={() => onSelectLocation(loc)}
              className="text-slate-300 hover:text-cyan-300 hover:underline px-1 py-0.5"
            >
              {loc.name}
            </button>
          ))}
          <button
            type="button"
            onClick={onClearRecent}
            className="text-slate-400 hover:text-rose-400 hover:underline px-1 py-0.5 ml-1"
            title="Clear recent search history"
          >
            Clear
          </button>
        </div>
      )}
    </section>
  );
};
