import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { Play, Pause, RotateCcw, CloudRain, Wind, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface RadarSimulationViewProps {
  data: WeatherData;
  convertTemp: (c: number) => number;
  lang: Language;
}

export const RadarSimulationView: React.FC<RadarSimulationViewProps> = ({
  data,
  convertTemp,
  lang,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [activeLayer, setActiveLayer] = useState<'rain' | 'wind'>('rain');
  const t = translations[lang];

  // Next 12 hours of genuine forecast data
  const hourlyFrames = data.hourly.slice(0, 12);
  const currentFrame = hourlyFrames[frameIndex] || hourlyFrames[0] || data.hourly[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % hourlyFrames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, hourlyFrames.length]);

  // Doppler precipitation density calculation from real metrics
  const precipProb = currentFrame?.precipitationProbability ?? 0;
  const precipMm = currentFrame?.precipitation ?? 0;
  const windSpeed = currentFrame?.windSpeed ?? 0;
  const windDir = currentFrame?.windDirection ?? 0;

  // Determine echo intensity
  const hasEcho = precipProb >= 15 || precipMm > 0;
  let echoSeverity = lang === 'en' ? 'Clear / No Echo' : 'Açık / Kütle Yok';
  let echoColor = '#00E676';
  if (precipMm > 3 || precipProb > 70) {
    echoSeverity = lang === 'en' ? 'Heavy Precipitation Cell' : 'Şiddetli Yağış Hücresi';
    echoColor = '#FF1E56';
  } else if (precipMm > 1 || precipProb > 40) {
    echoSeverity = lang === 'en' ? 'Moderate Rain Shower' : 'Orta Şiddette Yağmur';
    echoColor = '#FFA000';
  } else if (hasEcho) {
    echoSeverity = lang === 'en' ? 'Light Drizzle / Mist' : 'Hafif / Çisenti';
    echoColor = '#00E5FF';
  }

  const northLetter = lang === 'en' ? 'N' : 'K';
  const southLetter = lang === 'en' ? 'S' : 'G';
  const eastLetter = lang === 'en' ? 'E' : 'D';
  const westLetter = lang === 'en' ? 'W' : 'B';

  return (
    <div className="px-4 py-4 space-y-4 font-comic max-w-md mx-auto">
      {/* Header & Layer Selector */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl font-black text-black dark:text-white tracking-wide leading-none uppercase">
            {t.radar.title}
          </h2>
          <p className="text-xs font-sans font-bold text-zinc-700 dark:text-zinc-400 mt-1">
            {data.city} · {lang === 'en' ? '12-Hour Live Projection' : '12 Saatlik Gerçek Projeksiyon'}
          </p>
        </div>

        {/* Layer Toggle Switch */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-[#1E1F2B] border-2 border-black shadow-[2px_2px_0_#000] shrink-0">
          <button
            onClick={() => setActiveLayer('rain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              activeLayer === 'rain'
                ? 'bg-[#00E5FF] text-black shadow-[1.5px_1.5px_0_#000] -translate-y-0.5'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <CloudRain size={13} className="stroke-[2.5]" />
            <span>{lang === 'en' ? 'RAIN' : 'YAĞIŞ'}</span>
          </button>
          <button
            onClick={() => setActiveLayer('wind')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              activeLayer === 'wind'
                ? 'bg-[#FFE800] text-black shadow-[1.5px_1.5px_0_#000] -translate-y-0.5'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Wind size={13} className="stroke-[2.5]" />
            <span>{lang === 'en' ? 'WIND' : 'RÜZGAR'}</span>
          </button>
        </div>
      </div>

      {/* Radar Main Scope Card */}
      <div className="rounded-3xl bg-white dark:bg-[#181924] pop-card border-3 border-black p-3.5 space-y-3 relative overflow-hidden">
        {/* Top Scope Status Badge */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#FFE800] border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E56] border border-black animate-ping" />
            <span className="font-black text-black text-xs uppercase">
              {data.city} {lang === 'en' ? 'RADAR (100 KM)' : 'RADARI (100 KM)'}
            </span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-white dark:bg-[#252736] border-2 border-black shadow-[2px_2px_0_#000] font-black text-black dark:text-white">
            {frameIndex === 0 ? t.hourly.now : currentFrame?.hour} · {convertTemp(currentFrame?.temperature ?? 0)}°
          </div>
        </div>

        {/* Circular Radar Screen */}
        <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-full bg-[#FFFDF0] dark:bg-[#12131C] border-4 border-black overflow-hidden shadow-[inset_0_0_12px_rgba(0,0,0,0.15)] flex items-center justify-center">
          {/* Ben-Day Dots Background Pattern */}
          <div className="absolute inset-0 bg-benday-dots opacity-40 pointer-events-none" />

          {/* SVG Range Reticle & Coordinates */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300">
            {/* Range Rings */}
            <circle cx="150" cy="150" r="140" fill="none" stroke="#000" strokeWidth="2.5" />
            <circle cx="150" cy="150" r="95" fill="none" stroke="#000" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
            <circle cx="150" cy="150" r="50" fill="none" stroke="#000" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

            {/* Crosshairs */}
            <line x1="150" y1="10" x2="150" y2="290" stroke="#000" strokeWidth="1.5" opacity="0.4" />
            <line x1="10" y1="150" x2="290" y2="150" stroke="#000" strokeWidth="1.5" opacity="0.4" />

            {/* Diagonals */}
            <line x1="51" y1="51" x2="249" y2="249" stroke="#000" strokeWidth="1" strokeDasharray="3 4" opacity="0.25" />
            <line x1="51" y1="249" x2="249" y2="51" stroke="#000" strokeWidth="1" strokeDasharray="3 4" opacity="0.25" />

            {/* Range Labels */}
            <text x="154" y="60" fill="#000" fontSize="9" fontWeight="900" fontFamily="sans-serif">66 km</text>
            <text x="154" y="105" fill="#000" fontSize="9" fontWeight="900" fontFamily="sans-serif">33 km</text>

            {/* Cardinal Markers */}
            <rect x="140" y="12" width="20" height="16" rx="4" fill="#FFE800" stroke="#000" strokeWidth="1.5" />
            <text x="150" y="24" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">{northLetter}</text>

            <rect x="140" y="272" width="20" height="16" rx="4" fill="#FFE800" stroke="#000" strokeWidth="1.5" />
            <text x="150" y="284" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">{southLetter}</text>

            <rect x="272" y="142" width="16" height="16" rx="4" fill="#FFE800" stroke="#000" strokeWidth="1.5" />
            <text x="280" y="154" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">{eastLetter}</text>

            <rect x="12" y="142" width="16" height="16" rx="4" fill="#FFE800" stroke="#000" strokeWidth="1.5" />
            <text x="20" y="154" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">{westLetter}</text>
          </svg>

          {/* ACTIVE LAYER 1: RAIN DOPPLER */}
          {activeLayer === 'rain' && (
            <div className="absolute inset-0 pointer-events-none">
              {hasEcho ? (
                <div
                  className="absolute rounded-full border-2 border-black transition-all duration-700 shadow-[2px_2px_0_#000]"
                  style={{
                    width: `${Math.min(180, 80 + precipProb * 1.2)}px`,
                    height: `${Math.min(150, 70 + precipProb * 1.0)}px`,
                    top: `${40 + Math.sin(frameIndex * 0.5) * 16}%`,
                    left: `${35 + Math.cos(frameIndex * 0.5) * 16}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: echoColor,
                    opacity: 0.85,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-center p-2">
                    <span className="text-[10px] font-comic font-black text-black bg-white/90 px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0_#000]">
                      %{precipProb} ({precipMm > 0 ? `${precipMm} mm` : (lang === 'en' ? 'Cloud' : 'Bulut')})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1 bg-white/90 border-2 border-black rounded-xl text-[11px] font-black text-zinc-700 shadow-[2px_2px_0_#000]">
                    {lang === 'en' ? 'NO ECHO · CLEAR SKIES' : 'KÜTLE YOK · AÇIK GÖKYÜZÜ'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE LAYER 2: WIND */}
          {activeLayer === 'wind' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-48 h-48 rounded-full flex items-center justify-center transition-transform duration-700"
                style={{ transform: `rotate(${windDir}deg)` }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-[#FF1E56]" />
                  <div className="w-2 h-20 bg-black rounded-full" />
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-black -mt-1" />
                </div>
              </div>
              <div className="absolute px-2.5 py-1 bg-[#FFE800] border border-black rounded-lg text-xs font-black text-black shadow-[1px_1px_0_#000]">
                {windSpeed} {lang === 'en' ? 'km/h' : 'km/s'} · {windDir}°
              </div>
            </div>
          )}

          {/* Sweeper */}
          <div
            className="absolute inset-0 pointer-events-none animate-spin"
            style={{ animationDuration: '4s', animationTimingFunction: 'linear' }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, rgba(0, 229, 255, 0.4) 0deg, rgba(0, 229, 255, 0.05) 45deg, transparent 60deg, transparent 360deg)',
              }}
            />
          </div>

          {/* Center */}
          <div className="absolute w-5 h-5 rounded-full bg-[#FF1E56] border-2 border-black flex items-center justify-center z-20 shadow-[1.5px_1.5px_0_#000]">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>

        {/* Legend */}
        <div className="bg-[#FFFDF0] dark:bg-[#1E1F2B] p-2.5 rounded-2xl border-2 border-black space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-black">
            <span className="text-black dark:text-white uppercase">
              {activeLayer === 'rain'
                ? (lang === 'en' ? 'PRECIPITATION INTENSITY' : 'YAĞIŞ ŞİDDETİ (dBZ)')
                : (lang === 'en' ? 'WIND VELOCITY SCALE' : 'RÜZGAR SKALASI')}
            </span>
            <span className="text-[#FF1E56]">{echoSeverity}</span>
          </div>

          {activeLayer === 'rain' ? (
            <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-black">
              <div className="py-1 rounded-lg bg-[#E0F2FE] border border-black text-black">
                {lang === 'en' ? 'CLEAR' : 'AÇIK'}
              </div>
              <div className="py-1 rounded-lg bg-[#00E5FF] border border-black text-black">
                {lang === 'en' ? 'LIGHT' : 'HAFİF'}
              </div>
              <div className="py-1 rounded-lg bg-[#FFA000] border border-black text-black">
                {lang === 'en' ? 'MODERATE' : 'ORTA'}
              </div>
              <div className="py-1 rounded-lg bg-[#FF1E56] border border-black text-white">
                {lang === 'en' ? 'HEAVY' : 'ŞİDDETLİ'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-black">
              <div className="py-1 rounded-lg bg-[#FFE800] border border-black text-black">
                {lang === 'en' ? '< 15 km/h (Calm)' : '< 15 km/s (Sakin)'}
              </div>
              <div className="py-1 rounded-lg bg-[#00E5FF] border border-black text-black">
                {lang === 'en' ? '15-35 km/h (Breeze)' : '15-35 km/s (Ilıman)'}
              </div>
              <div className="py-1 rounded-lg bg-[#FF1E56] border border-black text-white">
                {lang === 'en' ? '> 35 km/h (Gale)' : '> 35 km/s (Sert)'}
              </div>
            </div>
          )}
        </div>

        {/* Live Frame Summary */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-white dark:bg-[#202230] rounded-xl border border-black shadow-[1.5px_1.5px_0_#000] flex items-center gap-1.5">
            <CloudRain size={16} className="text-[#00E5FF] stroke-[2.5]" />
            <div>
              <span className="text-[10px] font-sans font-bold text-zinc-600 dark:text-zinc-400 block leading-tight">
                {lang === 'en' ? 'Precipitation Chance' : 'Yağış İhtimali'}
              </span>
              <span className="font-black text-black dark:text-white">%{precipProb} ({precipMm} mm)</span>
            </div>
          </div>

          <div className="p-2 bg-white dark:bg-[#202230] rounded-xl border border-black shadow-[1.5px_1.5px_0_#000] flex items-center gap-1.5">
            <Wind size={16} className="text-black dark:text-white stroke-[2.5]" />
            <div>
              <span className="text-[10px] font-sans font-bold text-zinc-600 dark:text-zinc-400 block leading-tight">
                {lang === 'en' ? 'Wind & Heading' : 'Rüzgar & Yön'}
              </span>
              <span className="font-black text-black dark:text-white">
                {windSpeed} {lang === 'en' ? 'km/h' : 'km/s'} ({windDir}°)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#181924] pop-card border-3 border-black space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-2xl bg-[#FFE800] text-black border-2 border-black flex items-center justify-center pop-btn shadow-[2px_2px_0_#000]"
              title={isPlaying ? (lang === 'en' ? 'Pause' : 'Durdur') : (lang === 'en' ? 'Play' : 'Oynat')}
            >
              {isPlaying ? <Pause size={18} className="stroke-[3]" /> : <Play size={18} className="stroke-[3] ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setFrameIndex((prev) => (prev - 1 + hourlyFrames.length) % hourlyFrames.length);
              }}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-[#252736] text-black dark:text-white border-2 border-black flex items-center justify-center pop-btn shadow-[2px_2px_0_#000]"
              title={lang === 'en' ? '1 Hour Back' : 'Bir Saat Önce'}
            >
              <ChevronLeft size={18} className="stroke-[3]" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setFrameIndex((prev) => (prev + 1) % hourlyFrames.length);
              }}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-[#252736] text-black dark:text-white border-2 border-black flex items-center justify-center pop-btn shadow-[2px_2px_0_#000]"
              title={lang === 'en' ? '1 Hour Forward' : 'Bir Saat Sonra'}
            >
              <ChevronRight size={18} className="stroke-[3]" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setFrameIndex(0);
              }}
              className="w-10 h-10 rounded-2xl bg-[#00E5FF] text-black border-2 border-black flex items-center justify-center pop-btn shadow-[2px_2px_0_#000]"
              title={lang === 'en' ? 'Reset to Now' : 'Şimdiye Sıfırla'}
            >
              <RotateCcw size={16} className="stroke-[3]" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-sans font-bold text-zinc-600 dark:text-zinc-400 block">
              {lang === 'en' ? 'Selected Hour' : 'Seçili Saat'}
            </span>
            <div className="text-base font-black text-black dark:text-white leading-none mt-0.5">
              {frameIndex === 0 ? t.hourly.now : currentFrame?.hour}
            </div>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1.5 pt-1">
          <input
            type="range"
            min={0}
            max={hourlyFrames.length - 1}
            value={frameIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setFrameIndex(Number(e.target.value));
            }}
            className="w-full accent-[#FF1E56] cursor-pointer h-3 bg-zinc-200 dark:bg-zinc-800 border-2 border-black rounded-lg shadow-inner"
          />
          <div className="flex justify-between text-[10px] font-black text-zinc-700 dark:text-zinc-400">
            <span>{t.hourly.now}</span>
            <span>+6H</span>
            <span>+12H</span>
          </div>
        </div>
      </div>
    </div>
  );
};
