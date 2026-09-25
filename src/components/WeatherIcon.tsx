/**
 * TRUEWEATHER Accessible Weather Icon System
 * Standardized SVG icon mapping matching WMO conditions.
 */

import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  Snowflake,
  Zap,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Compass,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
  accessibleLabel?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = 'w-6 h-6',
  size = 24,
  accessibleLabel,
}) => {
  const getIconElement = () => {
    switch (name) {
      case 'Sun':
        return <Sun size={size} className={`text-amber-400 ${className}`} aria-hidden="true" />;
      case 'Moon':
        return <Moon size={size} className={`text-indigo-200 ${className}`} aria-hidden="true" />;
      case 'SunDim':
        return <Sun size={size} className={`text-amber-300 opacity-90 ${className}`} aria-hidden="true" />;
      case 'MoonStar':
        return <Moon size={size} className={`text-indigo-300 ${className}`} aria-hidden="true" />;
      case 'CloudSun':
        return <CloudSun size={size} className={`text-amber-300 ${className}`} aria-hidden="true" />;
      case 'CloudMoon':
        return <CloudMoon size={size} className={`text-indigo-300 ${className}`} aria-hidden="true" />;
      case 'Cloud':
        return <Cloud size={size} className={`text-slate-300 ${className}`} aria-hidden="true" />;
      case 'CloudFog':
        return <CloudFog size={size} className={`text-slate-400 ${className}`} aria-hidden="true" />;
      case 'CloudDrizzle':
        return <CloudDrizzle size={size} className={`text-sky-300 ${className}`} aria-hidden="true" />;
      case 'CloudRain':
        return <CloudRain size={size} className={`text-sky-400 ${className}`} aria-hidden="true" />;
      case 'CloudRainWind':
        return <CloudRainWind size={size} className={`text-sky-500 ${className}`} aria-hidden="true" />;
      case 'CloudLightning':
        return <CloudLightning size={size} className={`text-yellow-400 ${className}`} aria-hidden="true" />;
      case 'Snowflake':
        return <Snowflake size={size} className={`text-cyan-200 ${className}`} aria-hidden="true" />;
      case 'Zap':
        return <Zap size={size} className={`text-yellow-400 fill-yellow-400/20 ${className}`} aria-hidden="true" />;
      case 'Wind':
        return <Wind size={size} className={`text-teal-300 ${className}`} aria-hidden="true" />;
      case 'Droplets':
        return <Droplets size={size} className={`text-sky-400 ${className}`} aria-hidden="true" />;
      case 'Thermometer':
        return <Thermometer size={size} className={`text-rose-400 ${className}`} aria-hidden="true" />;
      case 'Compass':
        return <Compass size={size} className={`text-cyan-400 ${className}`} aria-hidden="true" />;
      case 'Eye':
        return <Eye size={size} className={`text-slate-300 ${className}`} aria-hidden="true" />;
      default:
        return <Cloud size={size} className={`text-slate-300 ${className}`} aria-hidden="true" />;
    }
  };

  return (
    <span className="inline-flex items-center justify-center shrink-0" title={accessibleLabel}>
      {getIconElement()}
      {accessibleLabel && <span className="sr-only">{accessibleLabel}</span>}
    </span>
  );
};
