import React, { useState, useEffect } from 'react';
import { Coordinates } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';
import { Search, X, MapPin, Plus, Trash2, Check, Zap } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: Coordinates) => void;
  savedCities: Coordinates[];
  onSaveCity: (city: Coordinates) => void;
  onRemoveCity: (lat: number, lon: number) => void;
  currentCity: Coordinates;
  lang: Language;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  savedCities,
  onSaveCity,
  onRemoveCity,
  currentCity,
  lang,
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Coordinates[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const t = translations[lang];

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchCities(query);
      setResults(res);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const isCurrent = (c: Coordinates) =>
    Math.abs(c.lat - currentCity.lat) < 0.05 && Math.abs(c.lon - currentCity.lon) < 0.05;

  const isSaved = (c: Coordinates) =>
    savedCities.some(
      (saved) => Math.abs(saved.lat - c.lat) < 0.05 && Math.abs(saved.lon - c.lon) < 0.05
    );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md h-[90vh] sm:h-[640px] bg-[#FFFDF0] dark:bg-[#13141B] border-4 border-black rounded-t-3xl sm:rounded-3xl flex flex-col shadow-[8px_8px_0_#000] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 font-comic">
        {/* Mobile Drag Handle */}
        <div className="w-16 h-2 bg-black rounded-full mx-auto my-2.5 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b-3 border-black bg-[#FFE800] dark:bg-[#1A1B24]">
          <div className="flex items-center gap-1.5">
            <Zap size={18} className="fill-[#FF1E56] text-[#FF1E56]" />
            <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-wider">
              {t.search.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#252736] border-2 border-black text-black dark:text-white pop-btn shadow-[2px_2px_0_#000] flex items-center justify-center transition-all"
            title={lang === 'en' ? 'Close' : 'Kapat'}
          >
            <X size={18} className="stroke-[3]" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b-2 border-black bg-white dark:bg-[#181924]">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-black dark:text-white stroke-[3]" />
            <input
              type="text"
              placeholder={t.search.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full h-12 pl-11 pr-10 rounded-2xl bg-[#FFFDF0] dark:bg-[#202230] border-2 border-black text-sm font-sans font-bold text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:bg-[#FFE800]/20 shadow-[2.5px_2.5px_0_#000] transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 text-black dark:text-white hover:scale-110"
              >
                <X size={17} className="stroke-[3]" />
              </button>
            )}
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#FFFDF0] dark:bg-[#13141B]">
          {/* Search Results */}
          {query.trim().length >= 2 ? (
            <div>
              <div className="text-xs uppercase text-black dark:text-white font-black mb-2 flex items-center gap-1">
                <span>{t.search.searchResults}</span>
                {isSearching && <span className="text-[#FF1E56]">{t.search.searching}</span>}
              </div>
              {results.length === 0 && !isSearching ? (
                <p className="text-xs font-sans font-bold text-zinc-600 dark:text-zinc-300 py-3 text-center bg-white dark:bg-[#1C1D27] border-2 border-black rounded-2xl p-3">
                  "{query}" {t.search.noResults}
                </p>
              ) : (
                <div className="space-y-2">
                  {results.map((city, idx) => {
                    const active = isCurrent(city);
                    const saved = isSaved(city);

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1C1D27] border-2 border-black shadow-[2.5px_2.5px_0_#000] hover:bg-[#FFE800]/30 transition-all"
                      >
                        <button
                          onClick={() => {
                            onSelectCity(city);
                            onClose();
                          }}
                          className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                        >
                          <MapPin size={17} className={active ? 'text-[#FF1E56] fill-[#FF1E56]' : 'text-black dark:text-white'} />
                          <div className="truncate">
                            <span className="text-base font-black text-black dark:text-white truncate block leading-none">
                              {city.name}
                            </span>
                            <span className="text-[11px] font-sans font-bold text-zinc-600 dark:text-zinc-400 truncate block">
                              {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                            </span>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {!saved ? (
                            <button
                              onClick={() => onSaveCity(city)}
                              className="px-3 py-1 rounded-xl text-xs bg-[#00E676] text-black border-2 border-black pop-btn shadow-[1.5px_1.5px_0_#000] flex items-center gap-1"
                            >
                              <Plus size={13} className="stroke-[3]" /> {t.search.save}
                            </button>
                          ) : (
                            <span className="text-xs bg-[#00E5FF] px-2 py-0.5 border border-black rounded-lg text-black font-black flex items-center gap-0.5">
                              <Check size={13} className="stroke-[3]" /> {t.search.saved}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* Saved Cities Section */}
          <div>
            <div className="text-xs uppercase text-black dark:text-white font-black mb-2">
              {t.search.savedCities} ({savedCities.length})
            </div>
            {savedCities.length === 0 ? (
              <p className="text-xs font-sans font-bold text-zinc-600 dark:text-zinc-400 py-2">
                {t.search.noSavedCities}
              </p>
            ) : (
              <div className="space-y-2">
                {savedCities.map((city, idx) => {
                  const active = isCurrent(city);

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 border-black shadow-[2.5px_2.5px_0_#000] transition-all ${
                        active
                          ? 'bg-[#FFE800] text-black'
                          : 'bg-white dark:bg-[#1C1D27] text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-[#252736]'
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectCity(city);
                          onClose();
                        }}
                        className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                      >
                        <MapPin size={17} className={active ? 'text-[#FF1E56] fill-[#FF1E56]' : 'text-black dark:text-white'} />
                        <div className="truncate">
                          <span className={`text-base font-black truncate block leading-none ${active ? 'text-black' : 'text-black dark:text-white'}`}>
                            {city.name}
                          </span>
                          <span className={`text-[11px] font-sans font-bold truncate block ${active ? 'text-zinc-800' : 'text-zinc-700 dark:text-zinc-400'}`}>
                            {city.country}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        {active && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#FF1E56] text-white border border-black rounded-lg font-black">
                            {lang === 'en' ? 'ACTIVE' : 'AKTİF'}
                          </span>
                        )}
                        <button
                          onClick={() => onRemoveCity(city.lat, city.lon)}
                          className="w-8 h-8 rounded-xl bg-white dark:bg-[#252736] border border-black text-black dark:text-white hover:bg-[#FF1E56] dark:hover:bg-[#FF1E56] hover:text-white flex items-center justify-center pop-btn shadow-[1.5px_1.5px_0_#000]"
                          title={lang === 'en' ? 'Delete' : 'Sil'}
                        >
                          <Trash2 size={14} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Popular Metros */}
          <div>
            <div className="text-xs uppercase text-black dark:text-white font-black mb-2">
              {t.search.popularCities}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CITIES.map((city, idx) => {
                const active = isCurrent(city);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className={`p-2.5 rounded-2xl text-left border-2 border-black shadow-[2px_2px_0_#000] pop-btn transition-all ${
                      active
                        ? 'bg-[#FFE800] text-black'
                        : 'bg-white dark:bg-[#1C1D27] text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-[#252736]'
                    }`}
                  >
                    <span className={`text-sm font-black block truncate leading-none ${active ? 'text-black' : 'text-black dark:text-white'}`}>
                      {city.name}
                    </span>
                    <span className={`text-[10px] font-sans font-bold block truncate mt-0.5 ${active ? 'text-zinc-800' : 'text-zinc-600 dark:text-zinc-400'}`}>
                      {city.country}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
