/**
 * TRUEWEATHER Top Bar
 * Follows the 3-zone Top Bar Contract: Brand Wordmark | Nav Links | Primary Actions
 */

import React from 'react';
import { TemperatureUnit, UserSettings } from '../types/weather';
import { Sparkles, SlidersHorizontal, Bookmark, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'weather' | 'forecast' | 'intelligence' | 'compare' | 'architecture';
  onSelectTab: (tab: 'weather' | 'forecast' | 'intelligence' | 'compare' | 'architecture') => void;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  onOpenSettings: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  tempUnit,
  onToggleTempUnit,
  onOpenSettings,
  onOpenFavorites,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#weather"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('weather');
            }}
            className="group flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
            <span className="font-mono tracking-wider">TRUEWEATHER</span>
          </a>
        </div>

        {/* Zone 2: 4-5 text navigation links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            onClick={() => onSelectTab('weather')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'weather'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400'
            }`}
          >
            Weather
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('forecast')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'forecast'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400'
            }`}
          >
            Forecast
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('intelligence')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'intelligence'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400'
            }`}
          >
            Intelligence
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('compare')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'compare'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400'
            }`}
          >
            Compare
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('architecture')}
            className={`transition-colors hover:text-white py-1 ${
              activeTab === 'architecture'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400'
            }`}
          >
            Architecture
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Unit Toggle Button */}
          <div
            className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg"
            role="group"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={tempUnit === 'fahrenheit' ? onToggleTempUnit : undefined}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                tempUnit === 'celsius'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={tempUnit === 'celsius'}
            >
              °C
            </button>
            <button
              type="button"
              onClick={tempUnit === 'celsius' ? onToggleTempUnit : undefined}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                tempUnit === 'fahrenheit'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={tempUnit === 'fahrenheit'}
            >
              °F
            </button>
          </div>

          {/* Favorites Button */}
          <button
            type="button"
            onClick={onOpenFavorites}
            className="relative p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
            title="Saved Favorite Locations"
            aria-label={`Favorites (${favoritesCount} saved)`}
          >
            <Bookmark size={18} aria-hidden="true" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* 3D Atmosphere / Engine Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
            title="3D Atmospheric & Performance Controls"
            aria-label="Atmospheric controls"
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
