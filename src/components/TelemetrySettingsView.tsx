import React from 'react';
import { WeatherData } from '../types/weather';
import { Radio, Languages, Sun, Moon } from 'lucide-react';
import { Language, translations } from '../services/i18n';
import { LanguageDropdown } from './LanguageDropdown';

interface TelemetrySettingsViewProps {
  data: WeatherData;
  isCelsius: boolean;
  onToggleUnit: () => void;
  onRefresh: () => void;
  lang: Language;
  onSelectLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  onToggleTheme: (theme: 'light' | 'dark') => void;
}

export const TelemetrySettingsView: React.FC<TelemetrySettingsViewProps> = ({
  data,
  isCelsius,
  onToggleUnit,
  onRefresh,
  lang,
  onSelectLanguage,
  theme,
  onToggleTheme,
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <div className="px-4 py-4 space-y-4 font-comic">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-wider">
          {t.settings.title}
        </h2>
        <p className="text-xs font-sans font-bold text-zinc-700 dark:text-zinc-400">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Raw Sensor Box */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1D27] pop-card border-3 border-black space-y-3">
        <div className="flex items-center justify-between pb-2 border-b-2 border-black dark:border-black">
          <div className="flex items-center gap-1.5 font-black text-sm text-black dark:text-white">
            <Radio size={16} className="text-[#FF1E56] stroke-[2.5]" />
            <span>{t.settings.telemetryTitle}</span>
          </div>
          <span className="px-2 py-0.5 bg-[#FFE800] text-black border border-black rounded text-[10px] font-black">
            {data.lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-[#FFE800] border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-sans font-bold text-zinc-800 block">
              {t.settings.latLon}
            </span>
            <span className="font-black text-sm text-black">
              {data.coordinates.lat.toFixed(3)}° / {data.coordinates.lon.toFixed(3)}°
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#00E5FF] border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-sans font-bold text-zinc-800 block">
              {t.settings.pressure}
            </span>
            <span className="font-black text-sm text-black">
              {data.current.pressure} hPa (mbar)
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#00E676] border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-sans font-bold text-zinc-800 block">
              {t.settings.windGust}
            </span>
            <span className="font-black text-sm text-black">
              {data.current.windGusts} km/s
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FF1E56] text-white border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-sans font-bold text-yellow-200 block">
              {t.settings.cloudCover}
            </span>
            <span className="font-black text-sm">
              %{data.current.cloudCover}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences Box */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1C1D27] pop-card border-3 border-black space-y-4">
        <div className="text-sm font-black text-black dark:text-white uppercase border-b-2 border-black pb-2 flex items-center justify-between">
          <span>{t.settings.displayPrefs}</span>
          <span className="text-[10px] px-2 py-0.5 bg-[#FFE800] text-black border border-black rounded-lg font-black">
            STUDIO
          </span>
        </div>

        {/* Kara Tema / Color Theme Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
          <div>
            <div className="flex items-center gap-1.5">
              {isDark ? (
                <Moon size={16} className="text-[#00E5FF] stroke-[2.5]" />
              ) : (
                <Sun size={16} className="text-[#FF9100] stroke-[2.5]" />
              )}
              <span className="text-sm font-black text-black dark:text-white block">
                {t.settings.theme}
              </span>
            </div>
            <span className="text-xs font-sans font-bold text-zinc-600 dark:text-zinc-400">
              {t.settings.themeDesc}
            </span>
          </div>

          {/* Theme Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-black/50 rounded-2xl border-2 border-black">
            <button
              onClick={() => onToggleTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                !isDark
                  ? 'bg-[#FFE800] text-black border-2 border-black shadow-[2px_2px_0_#000]'
                  : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border-2 border-transparent'
              }`}
            >
              <Sun size={13} className="stroke-[2.5]" />
              <span>{t.settings.lightTheme}</span>
            </button>
            <button
              onClick={() => onToggleTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                isDark
                  ? 'bg-[#00E5FF] text-black border-2 border-black shadow-[2px_2px_0_#000]'
                  : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border-2 border-transparent'
              }`}
            >
              <Moon size={13} className="stroke-[2.5]" />
              <span>{t.settings.darkTheme}</span>
            </button>
          </div>
        </div>

        {/* Language Selection with Scalable Dropdown Menu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1 border-t-2 border-black/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-1.5">
              <Languages size={15} className="text-[#FF1E56] stroke-[2.5]" />
              <span className="text-sm font-black text-black dark:text-white block">{t.settings.language}</span>
            </div>
            <span className="text-xs font-sans font-bold text-zinc-600 dark:text-zinc-400">
              {t.settings.languageDesc}
            </span>
          </div>

          <LanguageDropdown
            currentLang={lang}
            onSelectLanguage={onSelectLanguage}
            variant="full"
          />
        </div>

        {/* Temperature Unit */}
        <div className="flex items-center justify-between py-1 border-t-2 border-black/10 dark:border-white/10">
          <div>
            <span className="text-sm font-black text-black dark:text-white block">{t.settings.unit}</span>
            <span className="text-xs font-sans font-bold text-zinc-600 dark:text-zinc-400">
              {t.settings.unitDesc}
            </span>
          </div>
          <button
            onClick={onToggleUnit}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFE800] text-black font-black text-xs border-2 border-black pop-btn shadow-[2px_2px_0_#000]"
          >
            {isCelsius ? '°C (Celsius)' : '°F (Fahrenheit)'}
          </button>
        </div>

        {/* Refresh Sensor Data */}
        <div className="flex items-center justify-between py-1 border-t-2 border-black/10 dark:border-white/10">
          <div>
            <span className="text-sm font-black text-black dark:text-white block">{t.settings.refreshData}</span>
            <span className="text-xs font-sans font-bold text-zinc-600 dark:text-zinc-400">
              {t.settings.refreshDataDesc}
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="px-3.5 py-1.5 rounded-xl bg-[#00E676] text-black font-black text-xs border-2 border-black pop-btn shadow-[2px_2px_0_#000]"
          >
            {t.settings.refreshBtn}
          </button>
        </div>
      </div>

      {/* App Branding Badge Card */}
      <div className="p-4 rounded-3xl bg-[#FFE800] border-3 border-black shadow-[4px_4px_0_#000] flex items-center gap-3">
        <img
          src="/pop-weather-icon.svg"
          alt="POP WEATHER"
          className="w-14 h-14 rounded-2xl border-2 border-black shadow-[2px_2px_0_#000] shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <span className="font-comic font-black text-base text-black uppercase tracking-wider block">
            POP WEATHER
          </span>
          <p className="font-sans font-bold text-xs text-zinc-800 leading-tight">
            {lang === 'en'
              ? 'Created by Oseyan · Pop Art Live Weather Experience'
              : 'Oseyan tarafından yapılmıştır · Pop Art Canlı Hava Durumu'}
          </p>
        </div>
      </div>
    </div>
  );
};
