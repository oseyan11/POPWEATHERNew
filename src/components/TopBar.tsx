import React from 'react';
import { Search, RotateCw, MapPin, Navigation } from 'lucide-react';
import { Coordinates } from '../types/weather';
import { Language, translations } from '../services/i18n';

interface TopBarProps {
  currentCity: Coordinates;
  onOpenSearch: () => void;
  onRefresh: () => void;
  onLocateUser: () => void;
  isLoading: boolean;
  lang: Language;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentCity,
  onOpenSearch,
  onRefresh,
  onLocateUser,
  isLoading,
  lang,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFE800] dark:bg-[#161722] border-b-3 border-black px-3 sm:px-4 pt-[max(env(safe-area-inset-top,0px),0.625rem)] pb-2.5 flex items-center justify-between shadow-[0_4px_0_#000]">
      {/* Brand & City Comic Badge */}
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-2 text-left group bg-white dark:bg-[#202230] border-2 border-black px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-[2.5px_2.5px_0_#000] pop-btn max-w-[170px] xs:max-w-[210px] sm:max-w-xs transition-all shrink min-w-0"
        title={t.search.title}
      >
        <div className="w-7 h-7 rounded-full bg-[#FF1E56] border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0_#000]">
          <MapPin size={14} className="text-white fill-white" />
        </div>
        <div className="truncate">
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-black font-comic tracking-wide text-black dark:text-white uppercase truncate leading-tight">
              {currentCity.name}
            </span>
            <span className="hidden xs:inline-block text-[9px] font-comic px-1.5 py-0.5 bg-[#00E5FF] text-black border border-black rounded-md font-black uppercase">
              {t.share.liveTag}
            </span>
          </div>
          {currentCity.country && (
            <p className="text-[10px] font-sans font-bold text-zinc-600 dark:text-zinc-400 truncate -mt-0.5">
              {currentCity.country}
            </p>
          )}
        </div>
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Locate User (GPS) */}
        <button
          onClick={onLocateUser}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-[#202230] border-2 border-black text-black dark:text-white pop-btn shadow-[2px_2px_0_#000]"
          title={t.topBar.myLocation}
          aria-label={t.topBar.myLocation}
        >
          <Navigation size={16} className="text-black dark:text-white fill-black/20 dark:fill-white/20" />
        </button>

        {/* Live Refresh */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl bg-[#00E5FF] border-2 border-black text-black pop-btn shadow-[2px_2px_0_#000] disabled:opacity-50"
          title={t.settings.refreshBtn}
          aria-label={t.settings.refreshBtn}
        >
          <RotateCw size={16} className={`stroke-[2.5] text-black ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Search Modal Trigger */}
        <button
          onClick={onOpenSearch}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl bg-[#00E676] border-2 border-black text-black pop-btn shadow-[2px_2px_0_#000]"
          title={t.search.title}
          aria-label={t.search.title}
        >
          <Search size={17} className="stroke-[3] text-black" />
        </button>
      </div>
    </header>
  );
};
