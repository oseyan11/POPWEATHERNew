import React from 'react';
import { WeatherData, getWeatherCondition } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { ComicMoonCard } from './ComicMoonCard';
import { ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { Language, translations, getLocalizedCondition } from '../services/i18n';

interface CurrentHeroProps {
  data: WeatherData;
  isCelsius: boolean;
  convertTemp: (c: number) => number;
  onOpenShare?: () => void;
  lang: Language;
}

export const CurrentHero: React.FC<CurrentHeroProps> = ({
  data,
  isCelsius: _isCelsius,
  convertTemp,
  onOpenShare: _onOpenShare,
  lang,
}) => {
  const t = translations[lang];
  const condition = getWeatherCondition(data.current.weatherCode);
  const localized = getLocalizedCondition(data.current.weatherCode, lang);

  const currentT = convertTemp(data.current.temperature);
  const feelsLikeT = convertTemp(data.current.apparentTemperature);
  const todayDaily = data.daily[0];
  const maxT = todayDaily ? convertTemp(todayDaily.temperatureMax) : currentT + 3;
  const minT = todayDaily ? convertTemp(todayDaily.temperatureMin) : currentT - 4;

  // Comic condition sound punchline (localized)
  let comicExclamation = lang === 'en' ? 'SPECTACULAR SKY!' : 'HARİKA BİR GÖKYÜZÜ!';
  if (condition.isThunder) comicExclamation = lang === 'en' ? 'LIGHTNING & THUNDER!' : 'ŞİMŞEK VE ŞANGIRTI!';
  else if (condition.isRain) comicExclamation = lang === 'en' ? 'SPLISH SPLASH RAIN!' : 'ŞAPIR ŞUPUR YAĞMUR!';
  else if (condition.isSnow) comicExclamation = lang === 'en' ? 'FREEZING COLD! BRRR!' : 'DONUYORUZ! BRRR!';
  else if (currentT > 28) comicExclamation = lang === 'en' ? 'SCORCHING HEAT! SIZZLE!' : 'KAVRULUYORUZ! YAN!';
  else if (condition.isClear) comicExclamation = lang === 'en' ? 'RADIANT SUNSHINE!' : 'PARIL PARIL GÜNEŞ!';
  else if (condition.isCloudy) comicExclamation = lang === 'en' ? 'CLOUD INVASION!' : 'BULUT İSTİLASI!';

  // Comic sound effect tag for weather icon
  const iconSoundTag = condition.isThunder
    ? 'POW!'
    : condition.isRain
    ? 'SPLASH!'
    : condition.isSnow
    ? 'BRRR!'
    : condition.isClear
    ? 'SHINE!'
    : condition.isCloudy
    ? 'WHAM!'
    : 'BOOM!';

  return (
    <section className="relative px-4 pt-4 pb-2 flex flex-col items-center text-center">
      {/* Pop Art Ben-Day dots halo behind the hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-benday-dots opacity-30 pointer-events-none" />

      {/* Comic Exclamation Banner Tag - High Contrast and Clear Typography */}
      <div className="relative mb-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FF1E56] border-2 border-black rounded-full shadow-[3px_3px_0_#000] rotate-[-2deg] hover:rotate-0 transition-transform cursor-pointer">
        <Zap size={15} className="fill-[#FFE800] text-[#FFE800] shrink-0" />
        <span className="font-comic text-white text-xs sm:text-sm tracking-wider uppercase font-black drop-shadow-[1px_1px_0_#000]">
          {comicExclamation}
        </span>
      </div>

      {/* Main Comic Speech Bubble Card */}
      <div className="relative w-full max-w-sm p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1F2B] pop-card-lg overflow-hidden speech-bubble-bottom">
        {/* Subtle comic background Ben-Day texture on corner */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-benday-dots-cyan opacity-20 rounded-bl-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-benday-dots-pink opacity-15 rounded-tr-3xl pointer-events-none" />

        {/* City and Context Header inside the bubble */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b-2 border-black/15 dark:border-white/15">
          <div className="flex items-center gap-1.5 text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] border border-black animate-pulse" />
            <span className="font-sans font-extrabold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
              {data.city ? `${data.city}` : (lang === 'en' ? 'CURRENT WEATHER' : 'MEVCUT HAVA')}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#FFE800] border border-black font-sans font-black text-[10px] uppercase text-black tracking-wide shadow-[1px_1px_0_#000]">
            {data.current.isDay ? (lang === 'en' ? 'DAY' : 'GÜNDÜZ') : (lang === 'en' ? 'NIGHT' : 'GECE')}
          </span>
        </div>

        {/* Centerpiece: Enlarged Comic Weather Symbol & Giant Temp & Comic Weather Condition */}
        <div className="relative z-10 pt-4 pb-3 flex items-center justify-center gap-4 sm:gap-6">
          {/* Comic Weather Icon Box */}
          <div className="relative group shrink-0">
            {/* Comic Action Starburst Layer Behind */}
            <div className="absolute -inset-2 bg-[#FF1E56] rounded-2xl rotate-6 border-2 border-black opacity-90 group-hover:rotate-12 transition-transform duration-300 shadow-[3px_3px_0_#000]" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FFE800] border-3 border-black flex flex-col items-center justify-center shadow-[4px_4px_0_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform overflow-hidden bg-benday-dots">
              {/* Comic gloss mark */}
              <div className="absolute top-1.5 left-2 w-2.5 h-2.5 rounded-full bg-white border border-black z-20 pointer-events-none" />

              {/* Big Comic Weather Icon */}
              <WeatherIcon
                code={data.current.weatherCode}
                isDay={data.current.isDay}
                size={58}
                className="relative z-10 filter drop-shadow-[2.5px_2.5px_0_#000] transition-transform duration-200 group-hover:scale-110"
              />

              {/* Comic Sound Action Sticker */}
              <span className="absolute bottom-1 right-1 z-10 px-1.5 py-0.5 bg-black text-[#FFE800] font-sans font-black text-[10px] sm:text-[11px] uppercase rounded border border-white tracking-wider leading-none shadow-[1px_1px_0_#000]">
                {iconSoundTag}
              </span>
            </div>
          </div>

          {/* Big Temperature + Ultra-Legible Weather Condition */}
          <div className="text-left flex flex-col justify-center min-w-0">
            {/* Temperature with clear readable contrast */}
            <h1 className="text-7xl sm:text-8xl font-black font-sans tracking-tight text-black dark:text-white leading-none">
              {currentT}<span className="text-[#FF1E56] font-comic font-black ml-0.5">°</span>
            </h1>

            {/* Weather Condition Badge - High-contrast readable bold text with pop art frame */}
            <div className="mt-2.5 self-start inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFE800] dark:bg-[#FFE800] text-black border-2 border-black rounded-xl shadow-[3px_3px_0_#000] hover:scale-105 transition-transform max-w-full">
              <span className="font-sans font-black text-sm sm:text-base uppercase tracking-tight text-black leading-snug">
                {localized.label}
              </span>
            </div>

            {/* Condition description hint (readable and crisp) */}
            <p className="mt-1 font-sans font-bold text-xs text-zinc-600 dark:text-zinc-300 truncate">
              {localized.description}
            </p>
          </div>
        </div>

        {/* High / Low & Feels Like Badges with high legibility */}
        <div className="relative z-10 mt-4 pt-3 flex flex-wrap items-center justify-center gap-2 text-xs border-t-2 border-black/15 dark:border-white/15">
          <div className="flex items-center gap-1 px-3 py-1 bg-[#00E5FF] border-2 border-black rounded-xl shadow-[2px_2px_0_#000] text-black">
            <ArrowUp size={14} className="stroke-[3] text-black" />
            <span className="font-sans font-extrabold">{t.hero.peak}: {maxT}°</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-[#FFE800] border-2 border-black rounded-xl shadow-[2px_2px_0_#000] text-black">
            <ArrowDown size={14} className="stroke-[3] text-black" />
            <span className="font-sans font-extrabold">{t.hero.dip}: {minT}°</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-[#00E676] border-2 border-black rounded-xl shadow-[2px_2px_0_#000] text-black">
            <span className="font-sans font-extrabold">{t.hero.feelsLike}: {feelsLikeT}°</span>
          </div>
        </div>
      </div>

      {/* 3-Column Metric Ticker Bar with clear contrast */}
      <div className="mt-4 w-full max-w-sm grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-[#FFE800] border-2 border-black rounded-xl shadow-[2.5px_2.5px_0_#000] text-black">
          <span className="block text-[11px] font-sans font-extrabold uppercase text-zinc-800">{t.metrics.humidity}</span>
          <span className="text-lg font-sans font-black">%{data.current.humidity}</span>
        </div>
        <div className="p-2 bg-[#00E5FF] border-2 border-black rounded-xl shadow-[2.5px_2.5px_0_#000] text-black">
          <span className="block text-[11px] font-sans font-extrabold uppercase text-zinc-800">{t.metrics.wind}</span>
          <span className="text-lg font-sans font-black">
            {data.current.windSpeed} <span className="text-xs font-bold">{lang === 'en' ? 'km/h' : 'km/s'}</span>
          </span>
        </div>
        <div className="p-2 bg-[#FF1E56] border-2 border-black rounded-xl text-white shadow-[2.5px_2.5px_0_#000]">
          <span className="block text-[11px] font-sans font-extrabold uppercase text-yellow-200">{t.metrics.pressure}</span>
          <span className="text-lg font-sans font-black">{data.current.pressure} <span className="text-xs font-bold">hPa</span></span>
        </div>
      </div>

      {/* Comic-Book Style Lunar Phase Card */}
      <ComicMoonCard lang={lang} />
    </section>
  );
};
