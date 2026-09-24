import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  Moon,
  CloudMoon,
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = '',
  size = 32,
}) => {
  // Clear
  if (code === 0) {
    return isDay ? (
      <div className="relative inline-block">
        <Sun
          size={size}
          className={`text-[#FFE800] fill-[#FFE800] stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
        />
      </div>
    ) : (
      <Moon
        size={size}
        className={`text-[#00E5FF] fill-[#00E5FF] stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    );
  }

  // Mainly clear
  if (code === 1) {
    return isDay ? (
      <SunMedium
        size={size}
        className={`text-[#FFDE00] fill-[#FFDE00] stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    ) : (
      <CloudMoon
        size={size}
        className={`text-[#00C2FF] fill-[#00C2FF] stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    );
  }

  // Partly cloudy
  if (code === 2) {
    return isDay ? (
      <CloudSun
        size={size}
        className={`text-[#FFDE00] fill-white stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    ) : (
      <CloudMoon
        size={size}
        className={`text-[#00E5FF] fill-white stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    );
  }

  // Overcast
  if (code === 3) {
    return (
      <Cloud
        size={size}
        className={`text-white fill-[#E0E7FF] stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    );
  }

  // Fog
  if (code === 45 || code === 48) {
    return (
      <CloudFog
        size={size}
        className={`text-zinc-200 fill-[#CBD5E1] stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    );
  }

  // Drizzle
  if (code >= 51 && code <= 55) {
    return (
      <CloudDrizzle
        size={size}
        className={`text-[#00E5FF] fill-white stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    );
  }

  // Rain
  if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
    return (
      <CloudRain
        size={size}
        className={`text-[#00C2FF] fill-white stroke-black stroke-[2.5] drop-shadow-[3px_3px_0_#000] ${className}`}
      />
    );
  }

  // Snow
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return (
      <Snowflake
        size={size}
        className={`text-[#00E5FF] fill-white stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
      />
    );
  }

  // Thunderstorm
  if (code >= 95) {
    return (
      <CloudLightning
        size={size}
        className={`text-[#FFE800] fill-[#FF1E56] stroke-black stroke-[2.5] drop-shadow-[3px_3px_0_#000] ${className}`}
      />
    );
  }

  return (
    <Cloud
      size={size}
      className={`text-white fill-white stroke-black stroke-[2.5] drop-shadow-[2px_2px_0_#000] ${className}`}
    />
  );
};
