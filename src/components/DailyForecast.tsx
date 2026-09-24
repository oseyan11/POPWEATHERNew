import React from 'react';
import { DailyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Calendar } from 'lucide-react';
import { Language, translations, formatLocalizedDayName } from '../services/i18n';

interface DailyForecastProps {
  items: DailyForecastItem[];
  currentTemp: number;
  convertTemp: (c: number) => number;
  lang: Language;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  items,
  currentTemp,
  convertTemp,
  lang,
}) => {
  const t = translations[lang];
  const allMins = items.map((d) => convertTemp(d.temperatureMin));
  const allMaxs = items.map((d) => convertTemp(d.temperatureMax));
  const globalMin = Math.min(...allMins, convertTemp(currentTemp));
  const globalMax = Math.max(...allMaxs, convertTemp(currentTemp));
  const totalRange = Math.max(globalMax - globalMin, 1);

  return (
    <section className="mx-4 my-2 p-3.5 rounded-3xl bg-white dark:bg-[#1C1D27] pop-card border-3 border-black">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-black dark:border-black font-comic text-xs">
        <div className="flex items-center gap-1.5 font-black text-black dark:text-white uppercase tracking-wider text-sm">
          <Calendar size={15} className="stroke-[2.5]" />
          <span>{t.daily.title}</span>
        </div>
        <span className="px-2 py-0.5 bg-[#FFE800] border border-black rounded text-[10px] font-bold text-black">
          {t.daily.badge}
        </span>
      </div>

      {/* Days List */}
      <div className="pt-2 divide-y-2 divide-black/10 dark:divide-white/10">
        {items.map((item, idx) => {
          const isToday = idx === 0;
          const minT = convertTemp(item.temperatureMin);
          const maxT = convertTemp(item.temperatureMax);
          const curT = convertTemp(currentTemp);
          const dayLabel = formatLocalizedDayName(item.date, idx, lang);

          const leftPercent = Math.max(0, Math.min(100, ((minT - globalMin) / totalRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((maxT - globalMin) / totalRange) * 100));
          const barWidth = Math.max(10, rightPercent - leftPercent);

          const curDotPercent = Math.max(
            0,
            Math.min(100, ((curT - minT) / Math.max(maxT - minT, 1)) * 100)
          );

          return (
            <div
              key={idx}
              className={`py-2 px-1 flex items-center justify-between gap-2 font-comic transition-colors ${
                isToday ? 'bg-[#FFE800]/25 rounded-xl' : ''
              }`}
            >
              {/* Day Label */}
              <div className="w-14 shrink-0">
                <span className={`text-xs font-black tracking-wide ${isToday ? 'text-[#FF1E56] underline' : 'text-black dark:text-white'}`}>
                  {dayLabel}
                </span>
              </div>

              {/* Weather Icon */}
              <div className="w-8 flex items-center justify-center shrink-0">
                <WeatherIcon code={item.weatherCode} size={22} />
              </div>

              {/* Rain Chance */}
              <div className="w-9 text-right shrink-0">
                {item.precipitationProbability > 10 ? (
                  <span className="text-[10px] px-1 py-0.2 bg-[#00E5FF] border border-black rounded font-black text-black">
                    %{item.precipitationProbability}
                  </span>
                ) : (
                  <span className="text-[10px] text-transparent select-none">-</span>
                )}
              </div>

              {/* Min Temp */}
              <span className="w-7 text-right text-zinc-700 dark:text-zinc-400 font-black text-xs shrink-0">
                {minT}°
              </span>

              {/* Pop Art Comic Spectrum Bar */}
              <div className="relative flex-1 h-2.5 mx-2 bg-zinc-200 dark:bg-zinc-800 border border-black rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#00E676] via-[#FFE800] to-[#FF1E56] border-r border-black"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${barWidth}%`,
                  }}
                />
                {/* Current Temp Dot Indicator */}
                {isToday && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FFE800] border-2 border-black shadow-[1px_1px_0_#000]"
                    style={{
                      left: `calc(${leftPercent}% + ${(barWidth * curDotPercent) / 100}% - 7px)`,
                    }}
                    title={`${t.daily.currentTemp}: ${curT}°`}
                  />
                )}
              </div>

              {/* Max Temp */}
              <span className="w-7 text-left text-black dark:text-white font-black text-xs shrink-0">
                {maxT}°
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
