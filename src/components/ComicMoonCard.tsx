import React from 'react';
import { Language } from '../services/i18n';
import { Sparkles } from 'lucide-react';

export type MoonPhaseKey =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface MoonPhaseInfo {
  key: MoonPhaseKey;
  phaseRatio: number; // 0..1
  name: string;
  comicTag: string;
  illumination: number; // 0..100%
  daysIntoCycle: number; // 0..29.5
}

// Calculate accurate Moon phase for a given date
// Using the known New Moon anchor of Jan 11, 2024 (Synodic month = 29.53058867 days)
export function getMoonPhase(date: Date = new Date(), lang: Language = 'tr'): MoonPhaseInfo {
  // Known reference new moon: 2024-01-11T11:57:00Z
  const knownNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)).getTime();
  const synodicMonth = 29.53058867;
  const currentMs = date.getTime();
  const diffDays = (currentMs - knownNewMoon) / (1000 * 60 * 60 * 24);
  const cycleDays = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
  const phaseRatio = cycleDays / synodicMonth;

  // Illumination calculation (approx cosine curve: 0 at new moon, 100 at full moon)
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * phaseRatio)) * 50);

  let key: MoonPhaseKey;
  if (cycleDays < 1.84) key = 'new_moon';
  else if (cycleDays < 5.53) key = 'waxing_crescent';
  else if (cycleDays < 9.22) key = 'first_quarter';
  else if (cycleDays < 12.91) key = 'waxing_gibbous';
  else if (cycleDays < 16.61) key = 'full_moon';
  else if (cycleDays < 20.3) key = 'waning_gibbous';
  else if (cycleDays < 23.99) key = 'last_quarter';
  else if (cycleDays < 27.68) key = 'waning_crescent';
  else key = 'new_moon';

  const names: Record<MoonPhaseKey, Record<Language, string>> = {
    new_moon: {
      tr: 'Yeni Ay',
      en: 'New Moon',
      de: 'Neumond',
      es: 'Luna Nueva',
      fr: 'Nouvelle Lune',
    },
    waxing_crescent: {
      tr: 'Hilal (Büyüyen)',
      en: 'Waxing Crescent',
      de: 'Zunehmende Sichel',
      es: 'Luna Creciente',
      fr: 'Premier Croissant',
    },
    first_quarter: {
      tr: 'İlk Dördün',
      en: 'First Quarter',
      de: 'Erstes Viertel',
      es: 'Cuarto Creciente',
      fr: 'Premier Quartier',
    },
    waxing_gibbous: {
      tr: 'Şişkin Ay (Büyüyen)',
      en: 'Waxing Gibbous',
      de: 'Zunehmender Mond',
      es: 'Gibosa Creciente',
      fr: 'Gibbeuse Croissante',
    },
    full_moon: {
      tr: 'Dolunay',
      en: 'Full Moon',
      de: 'Vollmond',
      es: 'Luna Llena',
      fr: 'Pleine Lune',
    },
    waning_gibbous: {
      tr: 'Şişkin Ay (Küçülen)',
      en: 'Waning Gibbous',
      de: 'Abnehmender Mond',
      es: 'Gibosa Menguante',
      fr: 'Gibbeuse Décroissante',
    },
    last_quarter: {
      tr: 'Son Dördün',
      en: 'Last Quarter',
      de: 'Letztes Viertel',
      es: 'Cuarto Menguante',
      fr: 'Dernier Quartier',
    },
    waning_crescent: {
      tr: 'Balkon Hilal (Küçülen)',
      en: 'Waning Crescent',
      de: 'Abnehmende Sichel',
      es: 'Luna Menguante',
      fr: 'Dernier Croissant',
    },
  };

  const tags: Record<MoonPhaseKey, Record<Language, string>> = {
    new_moon: { tr: 'GİZEMLİ GECE', en: 'DARK SKY', de: 'DUNKEL', es: 'OSCURO', fr: 'NUIT NOIRE' },
    waxing_crescent: { tr: 'HİLAL PARLIYOR', en: 'CRESCENT GLOW', de: 'SICHEL GLANZ', es: 'BRILLO', fr: 'LUEUR' },
    first_quarter: { tr: 'YARI AY AYDINLIĞI', en: 'HALF GLOW', de: 'HALBMOND', es: 'MEDIA LUNA', fr: 'DEMI-LUNE' },
    waxing_gibbous: { tr: 'BÜYÜYEN AY', en: 'GROWING BIG', de: 'WACHSEND', es: 'CRECIENDO', fr: 'GRANDISSANT' },
    full_moon: { tr: 'SÜPER PARLAK!', en: 'MAX SHINE!', de: 'VOLLSTRAHL!', es: 'PLENITUD!', fr: 'ÉCLAT TOTAL!' },
    waning_gibbous: { tr: 'GÖKYÜZÜ FENERİ', en: 'NIGHT BEACON', de: 'LEUCHTET', es: 'LINTERNA', fr: 'LANTERNE' },
    last_quarter: { tr: 'GÜMÜŞ KESİT', en: 'SILVER CUT', de: 'SILBERSCHNITT', es: 'PLATA', fr: 'COUPE ARGENT' },
    waning_crescent: { tr: 'ŞAFAK HİLALİ', en: 'DAWN CRESCENT', de: 'MORGENSICHEL', es: 'AMANECER', fr: 'AUBE' },
  };

  return {
    key,
    phaseRatio,
    name: names[key][lang] || names[key].en,
    comicTag: tags[key][lang] || tags[key].en,
    illumination,
    daysIntoCycle: Math.round(cycleDays * 10) / 10,
  };
}

interface ComicMoonGraphicProps {
  phase: MoonPhaseKey;
  size?: number;
}

export const ComicMoonGraphic: React.FC<ComicMoonGraphicProps> = ({ phase, size = 68 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0 filter drop-shadow-[2.5px_2.5px_0_#000]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Comic Crater and Halftone pattern */}
        <pattern id="moon-halftone" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.6" fill="#3D3B54" />
        </pattern>
        <pattern id="moon-dots-yellow" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.3" fill="#E5B200" opacity="0.6" />
        </pattern>
        <clipPath id="moon-sphere-clip">
          <circle cx="50" cy="50" r="42" />
        </clipPath>
      </defs>

      {/* Comic Outer Thick Halo & Glow */}
      <circle cx="50" cy="50" r="46" fill="#FFE800" opacity="0.3" />

      {/* Main Base Sphere (Dark side: deep comic midnight purple/navy) */}
      <circle cx="50" cy="50" r="42" fill="#1C1B2A" stroke="#000000" strokeWidth="6" />
      {/* Dark side halftone dots */}
      <circle cx="50" cy="50" r="42" fill="url(#moon-halftone)" opacity="0.75" />

      {/* Moon Illuminated Side Drawing by Phase */}
      <g clipPath="url(#moon-sphere-clip)">
        {phase === 'full_moon' && (
          <g>
            <circle cx="50" cy="50" r="42" fill="#FFF275" />
            <circle cx="50" cy="50" r="42" fill="url(#moon-dots-yellow)" />
            {/* Pop art comic craters */}
            <circle cx="36" cy="38" r="8" fill="#E5B800" stroke="#000" strokeWidth="2.5" />
            <circle cx="62" cy="42" r="11" fill="#E5B800" stroke="#000" strokeWidth="2.5" />
            <circle cx="48" cy="66" r="9" fill="#E5B800" stroke="#000" strokeWidth="2.5" />
            <circle cx="32" cy="62" r="5" fill="#E5B800" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {phase === 'new_moon' && (
          <g>
            {/* Dark new moon with comic outline and subtle faint rim */}
            <path
              d="M 50,8 A 42,42 0 0,1 50,92 A 40,42 0 0,0 50,8"
              fill="#FFE800"
              opacity="0.35"
            />
          </g>
        )}

        {phase === 'waxing_crescent' && (
          <g>
            {/* Crescent on right */}
            <path
              d="M 50,8 A 42,42 0 0,1 50,92 A 26,42 0 0,0 50,8"
              fill="#FFF275"
              stroke="#000000"
              strokeWidth="3.5"
            />
            <path d="M 50,8 A 42,42 0 0,1 50,92 A 26,42 0 0,0 50,8" fill="url(#moon-dots-yellow)" />
            <circle cx="66" cy="48" r="6" fill="#E5B800" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {phase === 'first_quarter' && (
          <g>
            {/* Exact right half illuminated */}
            <path d="M 50,8 A 42,42 0 0,1 50,92 Z" fill="#FFF275" stroke="#000000" strokeWidth="3.5" />
            <path d="M 50,8 A 42,42 0 0,1 50,92 Z" fill="url(#moon-dots-yellow)" />
            <circle cx="64" cy="40" r="7" fill="#E5B800" stroke="#000" strokeWidth="2" />
            <circle cx="70" cy="62" r="5" fill="#E5B800" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {phase === 'waxing_gibbous' && (
          <g>
            {/* More than half illuminated on right */}
            <path
              d="M 50,8 A 42,42 0 0,1 50,92 A 22,42 0 0,1 50,8"
              fill="#FFF275"
              stroke="#000000"
              strokeWidth="3.5"
            />
            <path d="M 50,8 A 42,42 0 0,1 50,92 A 22,42 0 0,1 50,8" fill="url(#moon-dots-yellow)" />
            <circle cx="48" cy="38" r="8" fill="#E5B800" stroke="#000" strokeWidth="2.5" />
            <circle cx="66" cy="56" r="9" fill="#E5B800" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {phase === 'waning_gibbous' && (
          <g>
            {/* More than half illuminated on left */}
            <path
              d="M 50,8 A 42,42 0 0,0 50,92 A 22,42 0 0,0 50,8"
              fill="#FFF275"
              stroke="#000000"
              strokeWidth="3.5"
            />
            <path d="M 50,8 A 42,42 0 0,0 50,92 A 22,42 0 0,0 50,8" fill="url(#moon-dots-yellow)" />
            <circle cx="52" cy="38" r="8" fill="#E5B800" stroke="#000" strokeWidth="2.5" />
            <circle cx="34" cy="56" r="9" fill="#E5B800" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {phase === 'last_quarter' && (
          <g>
            {/* Exact left half illuminated */}
            <path d="M 50,8 A 42,42 0 0,0 50,92 Z" fill="#FFF275" stroke="#000000" strokeWidth="3.5" />
            <path d="M 50,8 A 42,42 0 0,0 50,92 Z" fill="url(#moon-dots-yellow)" />
            <circle cx="36" cy="40" r="7" fill="#E5B800" stroke="#000" strokeWidth="2" />
            <circle cx="30" cy="62" r="5" fill="#E5B800" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {phase === 'waning_crescent' && (
          <g>
            {/* Crescent on left */}
            <path
              d="M 50,8 A 42,42 0 0,0 50,92 A 26,42 0 0,1 50,8"
              fill="#FFF275"
              stroke="#000000"
              strokeWidth="3.5"
            />
            <path d="M 50,8 A 42,42 0 0,0 50,92 A 26,42 0 0,1 50,8" fill="url(#moon-dots-yellow)" />
            <circle cx="34" cy="48" r="6" fill="#E5B800" stroke="#000" strokeWidth="2" />
          </g>
        )}
      </g>

      {/* Pop Art Comic Gloss / White Highlight Specular Arc */}
      <path
        d="M 22,30 A 34,34 0 0,1 44,18"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="38" r="2.5" fill="#FFFFFF" />

      {/* Comic Book Outline Rim */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#000000" strokeWidth="6" />
    </svg>
  );
};

interface ComicMoonCardProps {
  lang: Language;
}

export const ComicMoonCard: React.FC<ComicMoonCardProps> = ({ lang }) => {
  const moon = getMoonPhase(new Date(), lang);

  const cardTitle = lang === 'en' ? 'LUNAR PHASE' : 'AYIN EVRESİ';
  const illuminationLabel = lang === 'en' ? 'Illumination' : 'Aydınlanma';
  const cycleLabel = lang === 'en' ? 'Lunar Day' : 'Ay Döngüsü';

  return (
    <div className="mt-4 w-full max-w-sm rounded-3xl bg-[#171926] border-3.5 border-black p-4 text-white pop-card-lg relative overflow-hidden bg-benday-dots">
      {/* Comic Halftone Corner Flair */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-benday-dots-yellow opacity-25 rounded-full pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-benday-dots-cyan opacity-20 rounded-full pointer-events-none" />

      {/* Header Band */}
      <div className="relative z-10 flex items-center justify-between pb-2.5 border-b-2 border-black/40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFE800] border border-black animate-ping" />
          <span className="font-comic font-black text-sm tracking-wider uppercase text-[#FFE800] drop-shadow-[1px_1px_0_#000]">
            {cardTitle}
          </span>
        </div>

        {/* Comic Sound Sticker */}
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF1E56] border-2 border-black font-comic font-black text-[10px] tracking-wider text-white rotate-[-3deg] shadow-[2px_2px_0_#000]">
          <Sparkles size={11} className="fill-[#FFE800] text-[#FFE800]" />
          {moon.comicTag}
        </span>
      </div>

      {/* Main Moon Display Row */}
      <div className="relative z-10 pt-3 pb-1 flex items-center justify-between gap-3.5">
        {/* Comic Moon Icon container with Neobrutalist pop frame */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-1.5 bg-[#FFE800] rounded-2xl rotate-3 border-2 border-black group-hover:rotate-6 transition-transform shadow-[2.5px_2.5px_0_#000]" />
          <div className="relative w-20 h-20 rounded-2xl bg-[#0D0F18] border-2.5 border-black flex items-center justify-center p-1 overflow-hidden bg-benday-dots-dense">
            <ComicMoonGraphic phase={moon.key} size={70} />
          </div>
        </div>

        {/* Moon Name & Information Badges */}
        <div className="flex-1 flex flex-col justify-center text-left min-w-0">
          <div className="inline-block self-start px-2.5 py-1 bg-white text-black border-2 border-black rounded-xl shadow-[2.5px_2.5px_0_#000] rotate-[-1deg] max-w-full">
            <h3 className="font-sans font-black text-sm sm:text-base uppercase tracking-tight text-black truncate leading-tight">
              {moon.name}
            </h3>
          </div>

          {/* Quick Metrics */}
          <div className="mt-2.5 flex items-center gap-2 text-xs font-sans font-extrabold flex-wrap">
            <div className="px-2 py-0.5 rounded-lg bg-[#FFE800] text-black border border-black shadow-[1.5px_1.5px_0_#000] flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase">{illuminationLabel}:</span>
              <span>%{moon.illumination}</span>
            </div>

            <div className="px-2 py-0.5 rounded-lg bg-[#00E5FF] text-black border border-black shadow-[1.5px_1.5px_0_#000] flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase">{cycleLabel}:</span>
              <span>{moon.daysIntoCycle} / 29.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
