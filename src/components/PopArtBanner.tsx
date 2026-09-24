import React from 'react';
import { Share2 } from 'lucide-react';
import { Language } from '../services/i18n';
import { PopWeatherAppIcon } from './PopWeatherAppIcon';

interface PopArtBannerProps {
  weatherCode: number;
  windSpeed: number;
  onOpenShare?: () => void;
  lang: Language;
}

export const PopArtBanner: React.FC<PopArtBannerProps> = ({
  weatherCode: _weatherCode,
  windSpeed: _windSpeed,
  onOpenShare,
  lang,
}) => {
  return (
    <div className="w-full flex items-center justify-between px-3 py-1.5 bg-[#FFFDF0] dark:bg-[#14151F] border-b-2 border-black text-xs font-comic overflow-hidden relative">
      <div className="flex items-center gap-2">
        <PopWeatherAppIcon size={24} className="shadow-[1px_1px_0_#000] rounded-lg" />
        <span className="px-2 py-0.5 bg-black text-[#FFE800] rounded-md font-comic text-xs uppercase tracking-wider font-black shadow-[1px_1px_0_#FFE800]">
          POP WEATHER
        </span>
        <span className="hidden sm:inline-block font-sans text-[11px] font-extrabold text-black dark:text-zinc-300">
          POP ART × COMIC WEATHER
        </span>
      </div>

      {/* Shareable Card Action Button */}
      {onOpenShare && (
        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00E5FF] border-2 border-black text-black font-comic font-black text-xs pop-btn shadow-[2px_2px_0_#000] hover:bg-[#FFE800] transition-colors"
          title={lang === 'en' ? 'Create & Share Weather Story' : 'Hava Durumu Kartı Oluştur ve Paylaş'}
        >
          <Share2 size={13} className="stroke-[2.5]" />
          <span>{lang === 'en' ? 'SHARE CARD' : 'KARTI PAYLAŞ'}</span>
        </button>
      )}
    </div>
  );
};
