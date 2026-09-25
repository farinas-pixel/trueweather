/**
 * TRUEWEATHER - TypeScript Type Definitions
 * Real Weather. Real Data. Real-Time Intelligence.
 */

export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone: string;
}

export type ConditionCategory =
  | 'clear'
  | 'partly_cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherConditionInfo {
  code: number;
  label: string;
  category: ConditionCategory;
  description: string;
  iconName: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  rain: number;
  showers: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  cloudCover: number;
  isDay: boolean;
  condition: WeatherConditionInfo;
}

export interface HourlyForecastItem {
  time: string;
  isoTime: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  condition: WeatherConditionInfo;
  maxTemp: number;
  minTemp: number;
  precipitationProbability: number;
  precipitationSum: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface SunData {
  sunrise: string;
  sunset: string;
  daylightDuration: string;
  isDay: boolean;
}

export type InsightCategory =
  | 'heat'
  | 'rain'
  | 'wind'
  | 'humidity'
  | 'outdoor'
  | 'uv'
  | 'glance';

export interface WeatherIntelligenceInsight {
  id: string;
  category: InsightCategory;
  title: string;
  observation: string;
  severity: 'neutral' | 'advisory' | 'caution' | 'positive';
  icon: string;
}

export interface NormalizedWeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  sun: SunData;
  insights: WeatherIntelligenceInsight[];
  glanceList: string[];
  rawRetrievedAt: string;
  apiResponseTimeMs: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';
export type PerformanceMode = 'auto' | 'high' | 'low';

export interface UserSettings {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  performanceMode: PerformanceMode;
  animationsEnabled: boolean;
  threeDEnabled: boolean;
}

export interface VisualAtmosphereState {
  category: ConditionCategory;
  conditionLabel: string;
  cloudDensity: number; // 0.0 - 1.0
  rainIntensity: number; // 0.0 - 1.0
  snowIntensity: number; // 0.0 - 1.0
  windSpeedKmh: number;
  windDirectionDeg: number;
  isDay: boolean;
  stormActive: boolean;
  fogDensity: number; // 0.0 - 1.0
  temperature: number;
}
