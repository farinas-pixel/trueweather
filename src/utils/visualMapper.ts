/**
 * TRUEWEATHER Visual Mapper
 * Maps real meteorological API values into 3D atmospheric visualization parameters.
 * Crucial separation: Never confuse raw physical variables with visual rendering parameters.
 */

import { CurrentWeather, HourlyForecastItem, VisualAtmosphereState } from '../types/weather';

export function deriveVisualState(
  weather: CurrentWeather | HourlyForecastItem,
  cloudCoverOverride?: number
): VisualAtmosphereState {
  const category = weather.condition.category;
  const isDay = weather.isDay;
  const temp = weather.temperature;

  let cloudDensity = 0.1;
  let rainIntensity = 0.0;
  let snowIntensity = 0.0;
  let fogDensity = 0.0;
  let stormActive = false;

  // Cloud cover mapping
  if (cloudCoverOverride !== undefined) {
    cloudDensity = Math.min(1.0, Math.max(0.05, cloudCoverOverride / 100));
  } else if ('cloudCover' in weather) {
    cloudDensity = Math.min(1.0, Math.max(0.05, weather.cloudCover / 100));
  } else {
    // Derive from category if hourly
    if (category === 'clear') cloudDensity = 0.05;
    else if (category === 'partly_cloudy') cloudDensity = 0.45;
    else if (category === 'overcast') cloudDensity = 0.95;
    else cloudDensity = 0.7;
  }

  // Precipitation & state mapping
  switch (category) {
    case 'clear':
      cloudDensity = Math.min(cloudDensity, 0.15);
      break;
    case 'partly_cloudy':
      cloudDensity = Math.max(0.3, Math.min(0.65, cloudDensity));
      break;
    case 'overcast':
      cloudDensity = Math.max(0.85, cloudDensity);
      break;
    case 'fog':
      cloudDensity = 0.75;
      fogDensity = 0.85;
      break;
    case 'drizzle':
      cloudDensity = 0.7;
      rainIntensity = 0.3;
      break;
    case 'rain':
      cloudDensity = 0.85;
      rainIntensity = 0.7;
      break;
    case 'snow':
      cloudDensity = 0.8;
      snowIntensity = 0.7;
      break;
    case 'thunderstorm':
      cloudDensity = 0.95;
      rainIntensity = 0.9;
      stormActive = true;
      break;
  }

  // Refine rain intensity from actual precipitation if available
  if ('precipitation' in weather && weather.precipitation > 0) {
    rainIntensity = Math.min(1.0, Math.max(0.2, weather.precipitation / 5));
  }

  const windSpeed = weather.windSpeed || 10;
  const windDirection = 'windDirection' in weather ? weather.windDirection : 45;

  return {
    category,
    conditionLabel: weather.condition.label,
    cloudDensity,
    rainIntensity,
    snowIntensity,
    windSpeedKmh: windSpeed,
    windDirectionDeg: windDirection,
    isDay,
    stormActive,
    fogDensity,
    temperature: temp,
  };
}
