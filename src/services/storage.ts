/**
 * TRUEWEATHER Storage Layer
 * LocalStorage wrapper with safe JSON parsing and boundary guards
 */

import { LocationData, UserSettings } from '../types/weather';

const RECENT_SEARCHES_KEY = 'trueweather_recent_searches_v1';
const FAVORITES_KEY = 'trueweather_favorites_v1';
const SETTINGS_KEY = 'trueweather_settings_v1';

const DEFAULT_SETTINGS: UserSettings = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  performanceMode: 'auto',
  animationsEnabled: true,
  threeDEnabled: true,
};

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[TRUEWEATHER] Failed to read localStorage key "${key}":`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[TRUEWEATHER] Failed to write localStorage key "${key}":`, err);
  }
}

// --- Recent Searches ---

export function getRecentSearches(): LocationData[] {
  return safeGetItem<LocationData[]>(RECENT_SEARCHES_KEY, []);
}

export function saveRecentSearch(location: LocationData): LocationData[] {
  const existing = getRecentSearches();
  // Filter out duplicate based on id or same name + country
  const filtered = existing.filter(
    (loc) => loc.id !== location.id && !(loc.name === location.name && loc.country === location.country)
  );
  // Prepend current location, limit to 6
  const updated = [location, ...filtered].slice(0, 6);
  safeSetItem(RECENT_SEARCHES_KEY, updated);
  return updated;
}

export function removeRecentSearch(locationId: number): LocationData[] {
  const existing = getRecentSearches();
  const updated = existing.filter((loc) => loc.id !== locationId);
  safeSetItem(RECENT_SEARCHES_KEY, updated);
  return updated;
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {
    console.warn(e);
  }
}

// --- Favorites ---

export function getFavorites(): LocationData[] {
  return safeGetItem<LocationData[]>(FAVORITES_KEY, []);
}

export function saveFavorite(location: LocationData): LocationData[] {
  const existing = getFavorites();
  if (existing.some((loc) => loc.id === location.id)) {
    return existing;
  }
  const updated = [location, ...existing].slice(0, 10);
  safeSetItem(FAVORITES_KEY, updated);
  return updated;
}

export function removeFavorite(locationId: number): LocationData[] {
  const existing = getFavorites();
  const updated = existing.filter((loc) => loc.id !== locationId);
  safeSetItem(FAVORITES_KEY, updated);
  return updated;
}

export function isFavorite(locationId: number): boolean {
  const existing = getFavorites();
  return existing.some((loc) => loc.id === locationId);
}

// --- Settings ---

export function getStoredSettings(): UserSettings {
  return safeGetItem<UserSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveStoredSettings(settings: UserSettings): void {
  safeSetItem(SETTINGS_KEY, settings);
}
