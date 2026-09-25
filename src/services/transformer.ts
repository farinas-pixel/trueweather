/**
 * TRUEWEATHER Data Transformation Layer
 * Converts raw Open-Meteo JSON into normalized, frontend-friendly state,
 * handles WMO code mapping, unit calculations, and weather intelligence analysis.
 */

import {
  ConditionCategory,
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  LocationData,
  NormalizedWeatherData,
  SunData,
  TemperatureUnit,
  WeatherConditionInfo,
  WeatherIntelligenceInsight,
  WindSpeedUnit,
} from '../types/weather';

/**
 * Standard WMO Weather Code dictionary
 */
export function getWeatherCondition(code: number, isDay = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        category: 'clear',
        description: isDay
          ? 'Sunlit sky with unobstructed solar radiation'
          : 'Clear night sky with high celestial visibility',
        iconName: isDay ? 'Sun' : 'Moon',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mainly Clear Night',
        category: 'partly_cloudy',
        description: 'Scattered high-altitude thin clouds with ample direct light',
        iconName: isDay ? 'SunDim' : 'MoonStar',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        category: 'partly_cloudy',
        description: 'Intermittent cumulus cloud cover with sun intervals',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        category: 'overcast',
        description: 'Complete layer of stratiform cloud cover diffusing sunlight',
        iconName: 'Cloud',
      };
    case 45:
      return {
        code,
        label: 'Fog',
        category: 'fog',
        description: 'Dense near-ground water droplets reducing horizontal visibility',
        iconName: 'CloudFog',
      };
    case 48:
      return {
        code,
        label: 'Depositing Rime Fog',
        category: 'fog',
        description: 'Supercooled fog forming ice crystals on exposed surfaces',
        iconName: 'CloudFog',
      };
    case 51:
      return {
        code,
        label: 'Light Drizzle',
        category: 'drizzle',
        description: 'Fine uniform water droplets with negligible accumulation rate',
        iconName: 'CloudDrizzle',
      };
    case 53:
      return {
        code,
        label: 'Moderate Drizzle',
        category: 'drizzle',
        description: 'Steady mist-like droplets creating damp surface conditions',
        iconName: 'CloudDrizzle',
      };
    case 55:
      return {
        code,
        label: 'Dense Drizzle',
        category: 'drizzle',
        description: 'Heavy drizzle with reduced visibility and continuous wetting',
        iconName: 'CloudDrizzle',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        category: 'drizzle',
        description: 'Supercooled drizzle freezing on contact with cold roadways',
        iconName: 'CloudSnow',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        category: 'rain',
        description: 'Gentle measurable rainfall with soft drops',
        iconName: 'CloudRain',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        category: 'rain',
        description: 'Steady persistent rainfall suitable for waterproof outerwear',
        iconName: 'CloudRain',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        category: 'rain',
        description: 'Substantial downpour with rapid surface runoff',
        iconName: 'CloudRainWind',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        category: 'rain',
        description: 'Liquid precipitation freezing on impact, potential glaze ice',
        iconName: 'CloudSnow',
      };
    case 71:
      return {
        code,
        label: 'Slight Snow',
        category: 'snow',
        description: 'Gentle flutter of frozen crystalline water vapor',
        iconName: 'Snowflake',
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow',
        category: 'snow',
        description: 'Continuous snowfall accumulating on untracked surfaces',
        iconName: 'Snowflake',
      };
    case 75:
      return {
        code,
        label: 'Heavy Snow',
        category: 'snow',
        description: 'Dense snowfall causing rapid accumulation and low visibility',
        iconName: 'Snowflake',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        category: 'snow',
        description: 'Very small opaque white ice grains that do not bounce',
        iconName: 'Snowflake',
      };
    case 80:
      return {
        code,
        label: 'Slight Showers',
        category: 'rain',
        description: 'Brief localized bursts of rain with rapid clearing',
        iconName: 'CloudRain',
      };
    case 81:
      return {
        code,
        label: 'Moderate Showers',
        category: 'rain',
        description: 'Vigorous intermittent rain showers between cloud breaks',
        iconName: 'CloudRainWind',
      };
    case 82:
      return {
        code,
        label: 'Violent Showers',
        category: 'rain',
        description: 'Intense short-duration torrent of convective rain',
        iconName: 'CloudLightning',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        category: 'snow',
        description: 'Sudden localized bursts of snow flakes',
        iconName: 'Snowflake',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        category: 'thunderstorm',
        description: 'Convective storm with electrical lightning discharges',
        iconName: 'Zap',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        category: 'thunderstorm',
        description: 'Severe electrical thunderstorm accompanied by ice pellets',
        iconName: 'CloudLightning',
      };
    default:
      return {
        code,
        label: 'Atmospheric Conditions',
        category: 'partly_cloudy',
        description: 'Typical regional atmospheric conditions',
        iconName: 'Cloud',
      };
  }
}

/**
 * Temperature conversion helper
 */
export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * Wind speed conversion helper
 */
export function convertWind(kmh: number, unit: WindSpeedUnit): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
}

/**
 * Compass 16-point direction string from meteorological degrees
 */
export function formatWindDirection(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

/**
 * Calculates daylight duration string from ISO sunrise and sunset
 */
function calculateDaylight(sunriseIso: string, sunsetIso: string): string {
  try {
    const rise = new Date(sunriseIso).getTime();
    const set = new Date(sunsetIso).getTime();
    const diffMs = set - rise;
    if (isNaN(diffMs) || diffMs <= 0) return '12h 00m';
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  } catch {
    return '12h 00m';
  }
}

/**
 * Extracts human hour:minute formatted string according to timezone
 */
export function formatTimeOnly(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return isoString.slice(11, 16) || '12:00';
  }
}

/**
 * Generates transparent, application-derived weather intelligence
 */
export function generateWeatherIntelligence(
  current: CurrentWeather,
  hourly: HourlyForecastItem[],
  daily: DailyForecastItem[],
  sun: SunData
): { insights: WeatherIntelligenceInsight[]; glanceList: string[] } {
  const insights: WeatherIntelligenceInsight[] = [];
  const glanceList: string[] = [];

  // 1. Heat / Temperature Insight
  const tempDiff = current.apparentTemperature - current.temperature;
  if (current.apparentTemperature >= 36) {
    insights.push({
      id: 'heat-high',
      category: 'heat',
      title: 'Heat Stress Observation',
      observation: `High apparent temperature (${Math.round(current.apparentTemperature)}°C). Prolonged outdoor exposure may cause thermal fatigue; prioritize regular hydration and shade.`,
      severity: 'caution',
      icon: 'Flame',
    });
    glanceList.push('Intense thermal load — hydration recommended.');
  } else if (tempDiff >= 3) {
    insights.push({
      id: 'heat-elevated',
      category: 'heat',
      title: 'Thermal Sensation Insight',
      observation: `Feels ${Math.round(tempDiff)}°C warmer than measured temperature due to atmospheric moisture content.`,
      severity: 'advisory',
      icon: 'ThermometerSun',
    });
    glanceList.push(`Perceived temperature elevated by ${Math.round(tempDiff)}°C over ambient.`);
  } else if (current.apparentTemperature <= 5) {
    insights.push({
      id: 'heat-cold',
      category: 'heat',
      title: 'Cold Perception Insight',
      observation: `Low ambient values combined with air movement produce a brisk sensation (${Math.round(current.apparentTemperature)}°C). Insulating layers recommended.`,
      severity: 'advisory',
      icon: 'Snowflake',
    });
    glanceList.push('Brisk ambient chill — layered outerwear recommended.');
  } else {
    insights.push({
      id: 'heat-moderate',
      category: 'heat',
      title: 'Thermal Equilibrium',
      observation: `Ambient temperature (${Math.round(current.temperature)}°C) is balanced with comfortable relative humidity levels.`,
      severity: 'positive',
      icon: 'Smile',
    });
  }

  // 2. Rain / Precipitation Insight
  const todayDaily = daily[0];
  const maxRainProb = todayDaily?.precipitationProbability || 0;
  const rainSum = todayDaily?.precipitationSum || 0;

  if (current.precipitation > 0 || current.rain > 0) {
    insights.push({
      id: 'rain-active',
      category: 'rain',
      title: 'Active Precipitation',
      observation: `Active rainfall measured at ${current.precipitation.toFixed(1)} mm/hr. Water-resistant outerwear or umbrella advised for travel.`,
      severity: 'caution',
      icon: 'CloudRain',
    });
    glanceList.push(`Active precipitation (${current.precipitation.toFixed(1)} mm/hr) underway.`);
  } else if (maxRainProb >= 50) {
    insights.push({
      id: 'rain-likely',
      category: 'rain',
      title: 'Precipitation Probability',
      observation: `Rain probability peaks at ${maxRainProb}% today with projected ${rainSum.toFixed(1)} mm sum. Consider carrying umbrella during outdoor commutes.`,
      severity: 'advisory',
      icon: 'CloudRainWind',
    });
    glanceList.push(`Precipitation probability peaks at ${maxRainProb}% today.`);
  } else {
    insights.push({
      id: 'rain-dry',
      category: 'rain',
      title: 'Dry Forecast Window',
      observation: `Low precipitation probability (${maxRainProb}%) for the rest of today with no significant rain accumulation projected.`,
      severity: 'positive',
      icon: 'Sun',
    });
    glanceList.push('Dry weather pattern expected for the next 24 hours.');
  }

  // 3. Wind Insight
  if (current.windGusts >= 45 || current.windSpeed >= 32) {
    insights.push({
      id: 'wind-strong',
      category: 'wind',
      title: 'Wind Velocity Insight',
      observation: `Brisk winds of ${Math.round(current.windSpeed)} km/h with gusts reaching ${Math.round(current.windGusts)} km/h from the ${formatWindDirection(current.windDirection)}. Secure loose outdoor equipment.`,
      severity: 'caution',
      icon: 'Wind',
    });
    glanceList.push(`Strong gusts peaking at ${Math.round(current.windGusts)} km/h.`);
  } else if (current.windSpeed >= 18) {
    insights.push({
      id: 'wind-moderate',
      category: 'wind',
      title: 'Breeze Observation',
      observation: `Moderate breeze of ${Math.round(current.windSpeed)} km/h (${formatWindDirection(current.windDirection)}). Provides natural air circulation.`,
      severity: 'neutral',
      icon: 'Wind',
    });
  } else {
    insights.push({
      id: 'wind-calm',
      category: 'wind',
      title: 'Calm Wind Conditions',
      observation: `Gentle air movement at ${Math.round(current.windSpeed)} km/h, well below levels causing mechanical resistance.`,
      severity: 'positive',
      icon: 'Wind',
    });
  }

  // 4. Humidity Insight
  if (current.relativeHumidity >= 80) {
    insights.push({
      id: 'humidity-high',
      category: 'humidity',
      title: 'Elevated Relative Humidity',
      observation: `High relative humidity (${Math.round(current.relativeHumidity)}%) inhibits evaporative cooling, which can make air feel muggier than dry readings indicate.`,
      severity: 'advisory',
      icon: 'Droplets',
    });
    glanceList.push(`Elevated moisture levels (${Math.round(current.relativeHumidity)}% RH).`);
  } else if (current.relativeHumidity <= 25) {
    insights.push({
      id: 'humidity-low',
      category: 'humidity',
      title: 'Dry Atmosphere Insight',
      observation: `Low relative humidity (${Math.round(current.relativeHumidity)}%). Air has high evaporation capacity; skin moisturization and hydration help maintain comfort.`,
      severity: 'neutral',
      icon: 'Droplets',
    });
  } else {
    insights.push({
      id: 'humidity-optimal',
      category: 'humidity',
      title: 'Comfortable Moisture Range',
      observation: `Relative humidity at ${Math.round(current.relativeHumidity)}% aligns with standard human respiratory comfort envelope.`,
      severity: 'positive',
      icon: 'Droplets',
    });
  }

  // 5. Outdoor Activity Assessment
  const isOutdoorComfortable =
    current.precipitation === 0 &&
    maxRainProb < 40 &&
    current.windSpeed < 28 &&
    current.apparentTemperature >= 14 &&
    current.apparentTemperature <= 32;

  if (isOutdoorComfortable) {
    insights.push({
      id: 'outdoor-ideal',
      category: 'outdoor',
      title: 'Outdoor Comfort Score',
      observation: 'Current meteorological variables (temperature, calm wind, zero precipitation) create very favorable conditions for walking, cycling, or outdoor dining.',
      severity: 'positive',
      icon: 'CheckCircle2',
    });
    glanceList.push('Favorable outdoor conditions across metrics.');
  } else if (current.precipitation > 0 || current.weatherCode >= 80) {
    insights.push({
      id: 'outdoor-rainy',
      category: 'outdoor',
      title: 'Outdoor Suitability',
      observation: 'Precipitation and wet surfaces are present. Outdoor activities requiring dry footing may need rescheduling or indoor alternatives.',
      severity: 'caution',
      icon: 'AlertCircle',
    });
  } else if (current.apparentTemperature > 34) {
    insights.push({
      id: 'outdoor-warm',
      category: 'outdoor',
      title: 'Midday Heat Notice',
      observation: 'Comfort is tempered by high thermal index. Mornings or late evenings provide significantly more pleasant recreational windows.',
      severity: 'advisory',
      icon: 'Clock',
    });
  }

  // 6. UV Index Insight if available
  if (todayDaily && todayDaily.uvIndexMax >= 7) {
    insights.push({
      id: 'uv-high',
      category: 'uv',
      title: 'Solar UV Index',
      observation: `Max UV Index reaches ${todayDaily.uvIndexMax.toFixed(1)} today. Sun protection (SPF, sunglasses) is advisable during midday solar transit.`,
      severity: 'advisory',
      icon: 'Sun',
    });
    glanceList.push(`Peak UV Index of ${todayDaily.uvIndexMax.toFixed(1)} expected.`);
  }

  // Ensure 3-5 glance points
  if (glanceList.length < 3) {
    if (sun.isDay) {
      glanceList.push(`Daylight duration: ${sun.daylightDuration}.`);
    } else {
      glanceList.push('Nighttime cooling underway; sky clarity intact.');
    }
  }

  return { insights, glanceList: glanceList.slice(0, 5) };
}

/**
 * Normalizes raw Open-Meteo API response into cohesive application state
 */
export function normalizeWeatherData(
  rawData: any,
  location: LocationData,
  responseTimeMs: number
): NormalizedWeatherData {
  const currentRaw = rawData.current;
  const isDay = Boolean(currentRaw.is_day);
  const condition = getWeatherCondition(currentRaw.weather_code, isDay);

  const current: CurrentWeather = {
    time: currentRaw.time,
    temperature: currentRaw.temperature_2m,
    apparentTemperature: currentRaw.apparent_temperature,
    relativeHumidity: currentRaw.relative_humidity_2m,
    precipitation: currentRaw.precipitation || 0,
    rain: currentRaw.rain || 0,
    showers: currentRaw.showers || 0,
    weatherCode: currentRaw.weather_code,
    windSpeed: currentRaw.wind_speed_10m,
    windDirection: currentRaw.wind_direction_10m,
    windGusts: currentRaw.wind_gusts_10m || currentRaw.wind_speed_10m * 1.2,
    cloudCover: currentRaw.cloud_cover || 0,
    isDay,
    condition,
  };

  // Hourly (next 24 hours starting from current hour)
  const hourlyRaw = rawData.hourly;
  const hourly: HourlyForecastItem[] = [];
  const currentTimeIso = currentRaw.time;

  // Find index closest to current time
  let startIndex = 0;
  if (hourlyRaw.time && Array.isArray(hourlyRaw.time)) {
    const idx = hourlyRaw.time.findIndex((t: string) => t >= currentTimeIso);
    if (idx !== -1) startIndex = idx;
  }

  for (let i = startIndex; i < Math.min(startIndex + 24, hourlyRaw.time?.length || 0); i++) {
    const hTime = hourlyRaw.time[i];
    const hIsDay = Boolean(hourlyRaw.is_day?.[i]);
    const hCode = hourlyRaw.weather_code?.[i] ?? 0;
    hourly.push({
      time: formatTimeOnly(hTime),
      isoTime: hTime,
      temperature: hourlyRaw.temperature_2m?.[i] ?? 0,
      apparentTemperature: hourlyRaw.apparent_temperature?.[i] ?? 0,
      precipitationProbability: hourlyRaw.precipitation_probability?.[i] ?? 0,
      precipitation: hourlyRaw.precipitation?.[i] ?? 0,
      weatherCode: hCode,
      condition: getWeatherCondition(hCode, hIsDay),
      windSpeed: hourlyRaw.wind_speed_10m?.[i] ?? 0,
      isDay: hIsDay,
    });
  }

  // Daily (7 days)
  const dailyRaw = rawData.daily;
  const daily: DailyForecastItem[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < (dailyRaw.time?.length || 0); i++) {
    const dateStr = dailyRaw.time[i];
    const d = new Date(dateStr);
    const dayName = i === 0 ? 'Today' : daysOfWeek[d.getDay()] || 'Day';
    const dCode = dailyRaw.weather_code?.[i] ?? 0;

    daily.push({
      date: dateStr,
      dayName,
      formattedDate: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      weatherCode: dCode,
      condition: getWeatherCondition(dCode, true),
      maxTemp: dailyRaw.temperature_2m_max?.[i] ?? 0,
      minTemp: dailyRaw.temperature_2m_min?.[i] ?? 0,
      precipitationProbability: dailyRaw.precipitation_probability_max?.[i] ?? 0,
      precipitationSum: dailyRaw.precipitation_sum?.[i] ?? 0,
      uvIndexMax: dailyRaw.uv_index_max?.[i] ?? 0,
      sunrise: dailyRaw.sunrise?.[i] ? formatTimeOnly(dailyRaw.sunrise[i]) : '06:00',
      sunset: dailyRaw.sunset?.[i] ? formatTimeOnly(dailyRaw.sunset[i]) : '18:00',
    });
  }

  // Sun and Daylight Duration
  const firstSunrise = dailyRaw.sunrise?.[0] || '';
  const firstSunset = dailyRaw.sunset?.[0] || '';
  const sun: SunData = {
    sunrise: firstSunrise ? formatTimeOnly(firstSunrise) : '06:00',
    sunset: firstSunset ? formatTimeOnly(firstSunset) : '18:00',
    daylightDuration: calculateDaylight(firstSunrise, firstSunset),
    isDay,
  };

  const { insights, glanceList } = generateWeatherIntelligence(current, hourly, daily, sun);

  return {
    location,
    current,
    hourly,
    daily,
    sun,
    insights,
    glanceList,
    rawRetrievedAt: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    apiResponseTimeMs: responseTimeMs,
  };
}
