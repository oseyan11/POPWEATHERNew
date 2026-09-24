import React, { useMemo, useState, useEffect } from 'react';

export interface DynamicWeatherDotsProps {
  weatherCode?: number;
  precipitation?: number;
  windSpeed?: number;
  isDay?: boolean;
  className?: string;
  isFixed?: boolean;
}

export interface DotPatternConfig {
  id: string;
  name: string;
  shortLabel: string;
  dotRadius: number; // in px
  gridSize: number; // in px
  primaryColor: string;
  secondaryColor?: string;
  animationClass: string;
  driftClass?: string;
  description: string;
  density: 'sparse' | 'medium' | 'dense' | 'electric';
}

export function getDotPatternForWeather(
  weatherCode = 0,
  precipitation = 0,
  isDay = true
): DotPatternConfig {
  // 1. Rain / Showers / Drizzle / High precipitation (Dense dots)
  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82) ||
    precipitation > 0.4
  ) {
    return {
      id: 'rain-dense',
      name: 'Yoğun Yağmur Ben-Day Noktaları',
      shortLabel: 'YOĞUN YAĞMUR',
      dotRadius: 3.2,
      gridSize: 10,
      primaryColor: '#00E5FF',
      secondaryColor: 'rgba(0, 0, 0, 0.48)',
      animationClass: 'animate-dot-breathe-rain',
      driftClass: 'animate-dot-rain-drift',
      description: 'Yağmur için sıkışık, ritmik Roy Lichtenstein Ben-Day dokusu',
      density: 'dense',
    };
  }

  // 2. Thunderstorm (Electric dense dots with high contrast)
  if (weatherCode >= 95 && weatherCode <= 99) {
    return {
      id: 'storm-electric',
      name: 'Elektrikli Fırtına Pop Noktaları',
      shortLabel: 'FIRTINA ELEKTRİK',
      dotRadius: 3.8,
      gridSize: 9,
      primaryColor: '#FF1E56',
      secondaryColor: '#FFE800',
      animationClass: 'animate-dot-breathe-storm',
      driftClass: 'animate-dot-rain-drift',
      description: 'Fırtına için titreşen, yüksek kontrastlı Pop Art noktaları',
      density: 'electric',
    };
  }

  // 3. Snow / Sleet (Fluffy polka dots)
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    return {
      id: 'snow-polka',
      name: 'Yumuşak Kar Polka Noktaları',
      shortLabel: 'KAR POLKA',
      dotRadius: 4.6,
      gridSize: 24,
      primaryColor: '#00E5FF',
      secondaryColor: 'rgba(255, 255, 255, 0.95)',
      animationClass: 'animate-dot-breathe-snow',
      driftClass: 'animate-dot-snow-drift',
      description: 'Kar yağışı için geniş aralıklı, süzülen iri polka noktaları',
      density: 'sparse',
    };
  }

  // 4. Fog / Mist (Fine haze dots)
  if (weatherCode === 45 || weatherCode === 48) {
    return {
      id: 'fog-mist',
      name: 'Sisli Haze Halftone Noktaları',
      shortLabel: 'SİSLİ MİST',
      dotRadius: 2.2,
      gridSize: 14,
      primaryColor: '#6B7280',
      secondaryColor: 'rgba(0, 0, 0, 0.3)',
      animationClass: 'animate-dot-breathe-fog',
      description: 'Sis için hafif opak, dağılan mist halftone dokusu',
      density: 'medium',
    };
  }

  // 5. Cloudy / Overcast (Medium density dots)
  if (weatherCode === 2 || weatherCode === 3) {
    return {
      id: 'cloudy-medium',
      name: 'Bulutlu Orta Yoğunluk Noktaları',
      shortLabel: 'ORTA BULUTLU',
      dotRadius: 2.8,
      gridSize: 18,
      primaryColor: '#0284C7',
      secondaryColor: 'rgba(0, 0, 0, 0.38)',
      animationClass: 'animate-dot-breathe-cloudy',
      description: 'Bulutlu hava için dengeli orta sıklıkta çizgi roman noktaları',
      density: 'medium',
    };
  }

  // 6. Sunny / Clear (Sparse dots - Default)
  return {
    id: 'sunny-sparse',
    name: 'Güneşli Seyrek Pop Halftone Noktaları',
    shortLabel: 'GÜNEŞLİ SEYREK',
    dotRadius: 2.4,
    gridSize: 28,
    primaryColor: isDay ? '#FFE800' : '#00E5FF',
    secondaryColor: 'rgba(0, 0, 0, 0.28)',
    animationClass: 'animate-dot-breathe-sunny',
    description: 'Açık hava için ferah, seyrek aralıklı nostaljik Ben-Day deseni',
    density: 'sparse',
  };
}

export const DynamicWeatherDots: React.FC<DynamicWeatherDotsProps> = ({
  weatherCode = 0,
  precipitation = 0,
  windSpeed = 0,
  isDay = true,
  className = '',
  isFixed = true,
}) => {
  const targetConfig = useMemo(
    () => getDotPatternForWeather(weatherCode, precipitation, isDay),
    [weatherCode, precipitation, isDay]
  );

  const [activeConfig, setActiveConfig] = useState<DotPatternConfig>(targetConfig);
  const [prevConfig, setPrevConfig] = useState<DotPatternConfig | null>(null);

  // Smooth cross-fade transition when weather pattern changes
  useEffect(() => {
    if (targetConfig.id !== activeConfig.id) {
      setPrevConfig(activeConfig);
      setActiveConfig(targetConfig);

      const timer = setTimeout(() => {
        setPrevConfig(null);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [targetConfig, activeConfig]);

  const renderDotLayer = (cfg: DotPatternConfig, isFadingOut: boolean = false) => {
    const dotPercent = Math.round((cfg.dotRadius / cfg.gridSize) * 100);

    return (
      <div
        key={cfg.id + (isFadingOut ? '-prev' : '-active')}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        } ${cfg.animationClass} ${cfg.driftClass || ''}`}
        style={{
          backgroundImage: cfg.secondaryColor
            ? `radial-gradient(${cfg.secondaryColor} ${dotPercent}%, transparent ${dotPercent}%), radial-gradient(${cfg.primaryColor} ${Math.max(
                dotPercent - 4,
                12
              )}%, transparent ${Math.max(dotPercent - 4, 12)}%)`
            : `radial-gradient(${cfg.primaryColor} ${dotPercent}%, transparent ${dotPercent}%)`,
          backgroundSize: cfg.secondaryColor
            ? `${cfg.gridSize}px ${cfg.gridSize}px, ${cfg.gridSize * 2}px ${cfg.gridSize * 2}px`
            : `${cfg.gridSize}px ${cfg.gridSize}px`,
          backgroundPosition: '0 0, 4px 4px',
        }}
      />
    );
  };

  return (
    <div
      aria-hidden="true"
      className={`${
        isFixed ? 'fixed inset-0' : 'absolute inset-0'
      } pointer-events-none z-0 overflow-hidden ${className}`}
    >
      {/* Previous Layer (Cross-fades out) */}
      {prevConfig && renderDotLayer(prevConfig, true)}

      {/* Active Layer (Animated opacity breathing & drift) */}
      {renderDotLayer(activeConfig, false)}

      {/* Subtle pop vignette border darkening */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.04)',
        }}
      />
    </div>
  );
};
