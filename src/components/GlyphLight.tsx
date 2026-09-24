import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface GlyphLightProps {
  weatherCode: number;
  windSpeed: number;
}

export const GlyphLight: React.FC<GlyphLightProps> = ({ weatherCode, windSpeed }) => {
  const [glyphActive, setGlyphActive] = useState<boolean>(true);
  const [flashTick, setFlashTick] = useState<boolean>(false);

  const handlePulse = () => {
    setFlashTick(true);
    setTimeout(() => setFlashTick(false), 300);
  };

  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-black/60 border-b border-white/[0.06] text-[11px] font-telemetry text-zinc-400">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        <span className="tracking-widest uppercase font-semibold text-zinc-300">
          GLYPH MATRIX
        </span>
      </div>

      {/* Nothing Glyph Light Strip Graphic */}
      <div
        onClick={handlePulse}
        title="Nothing Glyph Işık Göstergesi (Dokunun)"
        className="flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all active:scale-95"
      >
        {/* Glyph Arc 1 */}
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            flashTick
              ? 'w-6 bg-white shadow-[0_0_12px_#fff]'
              : glyphActive
              ? isRain
                ? 'w-4 bg-red-500/80 animate-pulse'
                : 'w-4 bg-zinc-300 shadow-[0_0_6px_rgba(255,255,255,0.4)]'
              : 'w-2 bg-zinc-700'
          }`}
        />
        {/* Glyph Arc 2 */}
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            flashTick
              ? 'w-10 bg-white shadow-[0_0_12px_#fff]'
              : glyphActive
              ? 'w-8 bg-zinc-200 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
              : 'w-4 bg-zinc-700'
          }`}
        />
        {/* Glyph Red Dot */}
        <div
          className={`h-2 w-2 rounded-full transition-all ${
            glyphActive ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-950'
          }`}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setGlyphActive(!glyphActive)}
          className="text-[10px] uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          {glyphActive ? 'AÇIK' : 'KAPALI'}
        </button>
      </div>
    </div>
  );
};
