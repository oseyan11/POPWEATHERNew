import React from 'react';
import { HourlyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Clock } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface HourlyForecastProps {
  items: HourlyForecastItem[];
  convertTemp: (c: number) => number;
  lang: Language;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  items,
  convertTemp,
  lang,
}) => {
  const t = translations[lang];

  // Pop Art comic palette sequence
  const colors = [
    'bg-[#FFE800] text-black',
    'bg-[#00E5FF] text-black',
    'bg-[#FFDE00] text-black',
    'bg-[#FFFDF0] dark:bg-[#2A2C3D] text-black dark:text-white',
    'bg-[#00E676] text-black',
    'bg-[#FF1E56] text-white',
  ];

  return (
    <section className="mx-4 my-2 p-3.5 rounded-3xl bg-white dark:bg-[#1C1D27] pop-card border-3 border-black">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-black dark:border-black text-xs font-comic">
        <div className="flex items-center gap-1.5 font-black text-black dark:text-white uppercase tracking-wider text-sm">
          <Clock size={15} className="stroke-[2.5]" />
          <span>{t.hourly.title}</span>
        </div>
        <span className="px-2 py-0.5 bg-[#FF1E56] text-white border border-black rounded text-[10px] font-bold">
          {lang === 'en' ? '24 HOURS' : '24 SAAT'}
        </span>
      </div>

      {/* Horizontal Carousel of Comic Panels */}
      <div className="pt-3 flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x py-1">
        {items.map((item, idx) => {
          const isNow = idx === 0;
          const temp = convertTemp(item.temperature);
          const colorClass = isNow ? 'bg-[#FFE800] text-black ring-2 ring-black' : colors[idx % colors.length];
          const hourLabel = isNow ? t.hourly.now : item.hour;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between min-w-[62px] py-2 px-1.5 rounded-2xl border-2 border-black shadow-[2.5px_2.5px_0_#000] transition-all snap-start ${colorClass}`}
            >
              {/* Hour Tag */}
              <span className="text-[11px] font-comic font-black tracking-wide">
                {hourLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-2 flex items-center justify-center h-8">
                <WeatherIcon code={item.weatherCode} isDay={item.isDay} size={26} />
              </div>

              {/* Rain Chance sticker */}
              <div className="h-4 mb-1 flex items-center justify-center">
                {item.precipitationProbability > 0 ? (
                  <span className="text-[10px] font-comic px-1 bg-white dark:bg-[#14151F] border border-black rounded text-black dark:text-white font-black">
                    %{item.precipitationProbability}
                  </span>
                ) : (
                  <span className="text-[10px] text-transparent select-none">-</span>
                )}
              </div>

              {/* Temperature */}
              <span className="text-base font-comic font-black tracking-tight leading-none">
                {temp}°
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
