/**
 * TRUEWEATHER — Intelligent Real-Time Weather Intelligence Dashboard & 3D World Experience
 * Real Weather. Real Data. Real-Time Intelligence.
 *
 * Core Technologies: Modern TypeScript, Fetch API, async/await, REST APIs, JSON processing,
 * HTML5 3D perspective projection atmosphere, WCAG AA accessibility, LocalStorage persistence.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  LocationData,
  NormalizedWeatherData,
  UserSettings,
  VisualAtmosphereState,
} from './types/weather';
import { fetchWeatherData, searchLocations, LocationNotFoundError, NetworkError } from './services/api';
import { normalizeWeatherData } from './services/transformer';
import {
  clearRecentSearches,
  getFavorites,
  getRecentSearches,
  getStoredSettings,
  isFavorite,
  removeFavorite,
  removeRecentSearch,
  saveFavorite,
  saveRecentSearch,
  saveStoredSettings,
} from './services/storage';
import { deriveVisualState } from './utils/visualMapper';

import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { AtmosphereCanvas } from './components/AtmosphereCanvas';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherIntelligenceSection } from './components/WeatherIntelligenceSection';
import { MetricsGrid } from './components/MetricsGrid';
import { HourlyTimeline } from './components/HourlyTimeline';
import { DailyForecast } from './components/DailyForecast';
import { LocationDetails } from './components/LocationDetails';
import { ComparisonMode } from './components/ComparisonMode';
import { DataInspectorModal } from './components/DataInspectorModal';
import { ApiFlowModal } from './components/ApiFlowModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { AtmosphereSettingsModal } from './components/AtmosphereSettingsModal';
import { Footer } from './components/Footer';

import {
  AlertTriangle,
  RefreshCw,
  Search,
  Compass,
  MapPin,
  Clock,
  Sparkles,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  // Application State
  const [weatherData, setWeatherData] = useState<NormalizedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ambiguousLocations, setAmbiguousLocations] = useState<LocationData[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    'weather' | 'forecast' | 'intelligence' | 'compare' | 'architecture'
  >('weather');

  // Scrubbed timeline hour index (null = current live conditions)
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);

  // Settings & Storage State
  const [settings, setSettings] = useState<UserSettings>(() => getStoredSettings());
  const [recentSearches, setRecentSearches] = useState<LocationData[]>(() => getRecentSearches());
  const [favorites, setFavorites] = useState<LocationData[]>(() => getFavorites());

  // Modal / Drawer open states
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // AbortController for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>('');

  // Save settings when changed
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      return updated;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    const defaults: UserSettings = {
      tempUnit: 'celsius',
      windUnit: 'kmh',
      performanceMode: 'auto',
      animationsEnabled: true,
      threeDEnabled: true,
    };
    setSettings(defaults);
    saveStoredSettings(defaults);
  }, []);

  // Fetch weather for a resolved LocationData
  const loadWeatherForLocation = useCallback(
    async (location: LocationData, isRefresh = false) => {
      // Abort prior inflight request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);
      setAmbiguousLocations([]);
      setSelectedHourIndex(null);

      try {
        const { rawData, responseTimeMs } = await fetchWeatherData(
          location.latitude,
          location.longitude,
          location.timezone,
          controller.signal
        );

        const normalized = normalizeWeatherData(rawData, location, responseTimeMs);
        setWeatherData(normalized);

        // Update recent searches in storage
        const updatedRecent = saveRecentSearch(location);
        setRecentSearches(updatedRecent);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Intentionally cancelled by user triggering newer search
          return;
        }
        console.error('[TRUEWEATHER API Error]:', err);
        setErrorMessage(
          err.message ||
            'Unable to retrieve weather right now. Please check your connection and try again.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Handle user query submission from SearchHero
  const handleSearch = useCallback(
    async (cityQuery: string) => {
      const trimmed = cityQuery.trim();
      if (!trimmed) return;

      lastQueryRef.current = trimmed;

      // Abort previous requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setErrorMessage(null);
      setAmbiguousLocations([]);

      try {
        const results = await searchLocations(trimmed, controller.signal);

        if (!results || results.length === 0) {
          throw new LocationNotFoundError(trimmed);
        }

        // If multiple distinct locations found, show disambiguation UI
        if (results.length > 1) {
          // If the first result is an exact match and others are lower relevance,
          // still provide disambiguation for user certainty as specified in section 9
          setAmbiguousLocations(results);
          // Pre-fetch the top candidate
          await loadWeatherForLocation(results[0]);
        } else {
          await loadWeatherForLocation(results[0]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('[TRUEWEATHER Search Error]:', err);
        if (err instanceof LocationNotFoundError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(
            'Unable to resolve location. Please check your connection and try again.'
          );
        }
        setIsLoading(false);
      }
    },
    [loadWeatherForLocation]
  );

  // GPS Geolocation Handler
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const gpsLocation: LocationData = {
          id: Math.floor(lat * 1000 + lon),
          name: 'Current Coordinates',
          latitude: lat,
          longitude: lon,
          country: 'Local',
          country_code: '',
          admin1: `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
        };

        setIsLocating(false);
        await loadWeatherForLocation(gpsLocation);
      },
      (err) => {
        setIsLocating(false);
        console.warn('[Geolocation Error]:', err);
        setErrorMessage(
          'Location access was declined or timed out. Please enter a city name manually.'
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [loadWeatherForLocation]);

  // Favorites toggle
  const handleToggleFavorite = useCallback(() => {
    if (!weatherData) return;
    const loc = weatherData.location;
    if (isFavorite(loc.id)) {
      const updated = removeFavorite(loc.id);
      setFavorites(updated);
    } else {
      const updated = saveFavorite(loc);
      setFavorites(updated);
    }
  }, [weatherData]);

  // Derived 3D atmosphere visual state
  const visualAtmosphereState: VisualAtmosphereState = useMemo(() => {
    if (!weatherData) {
      // Default calm twilight baseline before first search
      return {
        category: 'clear',
        conditionLabel: 'Clear Sky',
        cloudDensity: 0.1,
        rainIntensity: 0.0,
        snowIntensity: 0.0,
        windSpeedKmh: 12,
        windDirectionDeg: 60,
        isDay: true,
        stormActive: false,
        fogDensity: 0.0,
        temperature: 24,
      };
    }

    // If an hour is selected on timeline, project that hour
    if (selectedHourIndex !== null && weatherData.hourly[selectedHourIndex]) {
      return deriveVisualState(weatherData.hourly[selectedHourIndex]);
    }

    return deriveVisualState(weatherData.current);
  }, [weatherData, selectedHourIndex]);

  // Check if current loaded location is favorite
  const isCurrentFavorite = useMemo(() => {
    if (!weatherData) return false;
    return favorites.some((f) => f.id === weatherData.location.id);
  }, [weatherData, favorites]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Atmospheric Canvas Engine */}
      <AtmosphereCanvas
        weatherState={visualAtmosphereState}
        performanceMode={settings.performanceMode}
        effectsEnabled={settings.threeDEnabled}
        animationEnabled={settings.animationsEnabled}
      />

      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'architecture') setIsArchitectureOpen(true);
        }}
        tempUnit={settings.tempUnit}
        onToggleTempUnit={() =>
          updateSettings({
            tempUnit: settings.tempUnit === 'celsius' ? 'fahrenheit' : 'celsius',
          })
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Hero */}
        <SearchHero
          onSearch={handleSearch}
          onSelectLocation={loadWeatherForLocation}
          isLoading={isLoading}
          ambiguousLocations={ambiguousLocations}
          onDismissAmbiguous={() => setAmbiguousLocations([])}
          recentSearches={recentSearches}
          onClearRecent={() => {
            clearRecentSearches();
            setRecentSearches([]);
          }}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
        />

        {/* Global Error Banner */}
        {errorMessage && (
          <div
            className="max-w-2xl mx-auto my-4 p-4 rounded-xl border border-rose-500/40 bg-rose-950/40 backdrop-blur-md flex items-start justify-between gap-3 text-rose-200 animate-in fade-in"
            role="alert"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-rose-100">Request Error</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            {lastQueryRef.current && (
              <button
                type="button"
                onClick={() => handleSearch(lastQueryRef.current)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-900 border border-rose-700/60 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                <RefreshCw size={12} aria-hidden="true" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        )}

        {/* Empty State when no city has been queried yet */}
        {!weatherData && !isLoading && !errorMessage && (
          <section
            className="my-12 text-center max-w-lg mx-auto p-8 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md"
            aria-label="Initial application status"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Compass size={32} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Search for a city to see live weather.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              Explore real-time atmospheric readings, 24-hour timelines, and intelligence derived from verified Open-Meteo REST endpoints.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Chennai', 'Bengaluru', 'Mumbai', 'London'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSearch(city)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all"
                >
                  {city}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Loading Overlay */}
        {isLoading && !weatherData && (
          <div className="my-16 text-center" aria-live="polite">
            <RefreshCw size={36} className="animate-spin text-cyan-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-white">Getting live weather...</p>
            <p className="text-xs text-slate-400 mt-1">Connecting to Open-Meteo REST service</p>
          </div>
        )}

        {/* Weather Dashboard Presentation */}
        {weatherData && (
          <div className="space-y-2 animate-in fade-in duration-300">
            {/* Timeline Scrub Indicator */}
            {selectedHourIndex !== null && (
              <div className="flex items-center justify-between bg-cyan-950/70 border border-cyan-500/40 rounded-xl px-4 py-2 text-xs text-cyan-200">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-cyan-400" aria-hidden="true" />
                  <span>
                    Previewing 3D atmosphere at{' '}
                    <strong>{weatherData.hourly[selectedHourIndex]?.time}</strong>:{' '}
                    {weatherData.hourly[selectedHourIndex]?.condition.label} (
                    {weatherData.hourly[selectedHourIndex]?.temperature}°C)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHourIndex(null)}
                  className="text-cyan-400 hover:text-white font-semibold underline ml-2"
                >
                  Reset to Live
                </button>
              </div>
            )}

            {/* Weather View */}
            {(activeTab === 'weather' || activeTab === 'forecast' || activeTab === 'intelligence') && (
              <>
                {/* 1. Main Current Weather Card */}
                <CurrentWeatherCard
                  location={weatherData.location}
                  weather={weatherData.current}
                  tempUnit={settings.tempUnit}
                  windUnit={settings.windUnit}
                  isFavorite={isCurrentFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onRefresh={() => loadWeatherForLocation(weatherData.location, true)}
                  isRefreshing={isRefreshing}
                  retrievedAt={weatherData.rawRetrievedAt}
                />

                {/* 2. Weather Intelligence Section */}
                <WeatherIntelligenceSection
                  insights={weatherData.insights}
                  glanceList={weatherData.glanceList}
                />

                {/* 3. Metrics Grid (8 Atmospheric Dimensions) */}
                <MetricsGrid
                  weather={weatherData.current}
                  sun={weatherData.sun}
                  tempUnit={settings.tempUnit}
                  windUnit={settings.windUnit}
                  uvIndexMax={weatherData.daily[0]?.uvIndexMax}
                />

                {/* 4. Hourly Forecast & 3D Atmosphere Timeline */}
                <HourlyTimeline
                  hourly={weatherData.hourly}
                  tempUnit={settings.tempUnit}
                  selectedHourIndex={selectedHourIndex}
                  onSelectHour={setSelectedHourIndex}
                />

                {/* 5. 7-Day Synoptic Forecast */}
                <DailyForecast
                  daily={weatherData.daily}
                  tempUnit={settings.tempUnit}
                />

                {/* 6. Real-World Geographic & Map View */}
                <LocationDetails location={weatherData.location} />
              </>
            )}

            {/* Compare Mode */}
            {activeTab === 'compare' && (
              <ComparisonMode
                currentData={weatherData}
                tempUnit={settings.tempUnit}
                windUnit={settings.windUnit}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Modals & Drawers */}
      {weatherData && (
        <DataInspectorModal
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          data={weatherData}
        />
      )}

      <ApiFlowModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectLocation={loadWeatherForLocation}
        onRemoveFavorite={(id) => {
          const updated = removeFavorite(id);
          setFavorites(updated);
        }}
      />

      <AtmosphereSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetPreferences={resetPreferences}
      />
    </div>
  );
}
