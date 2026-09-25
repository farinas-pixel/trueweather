/**
 * TRUEWEATHER API Layer
 * Real REST API integration with Open-Meteo Geocoding & Weather Forecast APIs.
 */

import { LocationData } from '../types/weather';

export class WeatherApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

export class LocationNotFoundError extends Error {
  constructor(public query: string) {
    super(`No matching locations found for "${query}". Please check the spelling.`);
    this.name = 'LocationNotFoundError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Unable to connect to the weather service. Please check your internet connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches locations using Open-Meteo Geocoding REST API
 */
export async function searchLocations(
  query: string,
  signal?: AbortSignal
): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const url = new URL(GEOCODING_BASE_URL);
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '8');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new WeatherApiError(
        `Geocoding request failed with status ${response.status}`,
        response.status,
        url.toString()
      );
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      throw new LocationNotFoundError(trimmed);
    }

    return data.results.map((item: any) => ({
      id: item.id || Math.floor(item.latitude * 1000 + item.longitude),
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
    }));
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err; // Let caller know it was cancelled intentionally
    }
    if (err instanceof LocationNotFoundError || err instanceof WeatherApiError) {
      throw err;
    }
    throw new NetworkError(
      err?.message || 'Unable to connect to geocoding service. Please check your network.'
    );
  }
}

/**
 * Fetches real weather data from Open-Meteo Forecast REST API
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone = 'auto',
  signal?: AbortSignal
): Promise<{ rawData: any; responseTimeMs: number }> {
  const url = new URL(WEATHER_BASE_URL);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('timezone', timezone || 'auto');

  // Current weather variables
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'rain',
      'showers',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'cloud_cover',
      'is_day',
    ].join(',')
  );

  // Hourly forecast variables (next 24-48 hours)
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(',')
  );

  // Daily forecast variables (7 days)
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'precipitation_sum',
      'uv_index_max',
      'sunrise',
      'sunset',
    ].join(',')
  );

  url.searchParams.set('forecast_days', '7');

  const startTime = performance.now();

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    const endTime = performance.now();
    const responseTimeMs = Math.round(endTime - startTime);

    if (!response.ok) {
      throw new WeatherApiError(
        `Weather forecast request failed with status ${response.status}`,
        response.status,
        url.toString()
      );
    }

    const rawData = await response.json();

    if (!rawData.current || !rawData.hourly || !rawData.daily) {
      throw new WeatherApiError('Incomplete weather payload returned by the provider.');
    }

    return { rawData, responseTimeMs };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new NetworkError(
      err?.message || 'Unable to retrieve weather right now. Please check your connection and try again.'
    );
  }
}
