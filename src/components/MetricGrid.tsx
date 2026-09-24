import React from 'react';
import { WeatherData } from '../types/weather';
import {
  Sun,
  Wind,
  Sunrise,
  Droplets,
  Gauge,
  Activity,
} from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface MetricGridProps {
  data: WeatherData;
  isCelsius: boolean;
  convertTemp: (c: number) => number;
  lang: Language;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  data,
  isCelsius,
  convertTemp,
  lang,
}) => {
  const current = data.current;
  const today = data.daily[0];
  const t = translations[lang];

  const uv = current.uvIndex;
  let uvText = lang === 'en' ? 'LOW' : 'DÜŞÜK';
  let uvBadgeColor = 'bg-[#00E676] text-black';
  if (uv >= 8) {
    uvText = lang === 'en' ? 'VERY HIGH!' : 'ÇOK YÜKSEK!';
    uvBadgeColor = 'bg-[#FF1E56] text-white';
  } else if (uv >= 6) {
    uvText = lang === 'en' ? 'HIGH!' : 'YÜKSEK!';
    uvBadgeColor = 'bg-[#FF9100] text-black';
  } else if (uv >= 3) {
    uvText = lang === 'en' ? 'MODERATE' : 'ORTA';
    uvBadgeColor = 'bg-[#FFE800] text-black';
  }

  // Sun calculations
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  let sunriseH = 6.5;
  let sunsetH = 19.5;
  if (today?.sunrise && today?.sunset) {
    const [srH, srM] = today.sunrise.split(':').map(Number);
    const [ssH, ssM] = today.sunset.split(':').map(Number);
    if (!isNaN(srH)) sunriseH = srH + (srM || 0) / 60;
    if (!isNaN(ssH)) sunsetH = ssH + (ssM || 0) / 60;
  }
  const dayLength = Math.max(sunsetH - sunriseH, 1);
  const sunProgress = Math.max(0, Math.min(1, (currentHour - sunriseH) / dayLength));
  const isNight = currentHour < sunriseH || currentHour > sunsetH;

  const dewPointC = Math.round(current.temperature - (100 - current.humidity) / 5);
  const dewPoint = convertTemp(dewPointC);

  const directionsTr = ['KUZEY', 'K.DOĞU', 'DOĞU', 'G.DOĞU', 'GÜNEY', 'G.BATI', 'BATI', 'K.BATI'];
  const directionsEn = ['NORTH', 'N.EAST', 'EAST', 'S.EAST', 'SOUTH', 'S.WEST', 'WEST', 'N.WEST'];
  const directions = lang === 'en' ? directionsEn : directionsTr;
  const dirIndex = Math.round(((current.windDirection %= 360) < 0 ? current.windDirection + 360 : current.windDirection) / 45) % 8;
  const windDirName = directions[dirIndex];

  return (
    <section className="mx-4 my-2 grid grid-cols-2 gap-3 pb-6 font-comic">
      {/* 1. UV INDEX */}
      <div className="p-3.5 rounded-3xl bg-[#FFFDF0] dark:bg-[#1C1D27] pop-card border-3 border-black flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between pb-1 border-b border-black dark:border-black">
          <div className="flex items-center gap-1 font-black text-xs text-black dark:text-white">
            <Sun size={15} className="fill-[#FFE800] text-black dark:text-white stroke-[2.5]" />
            <span>{t.metrics.uv}</span>
          </div>
          <span className={`px-1.5 py-0.2 rounded border border-black text-[10px] font-black ${uvBadgeColor}`}>
            {uvText}
          </span>
        </div>

        <div className="my-2">
          <div className="text-4xl font-black text-black dark:text-white leading-none">
            {uv} <span className="text-sm font-sans font-bold text-zinc-600 dark:text-zinc-400">/ 11</span>
          </div>
          <p className="mt-1 text-[11px] font-sans font-bold text-zinc-800 dark:text-zinc-300 leading-tight">
            {uv <= 2
              ? (lang === 'en' ? 'No sun protection required.' : 'Güneş koruması gerekmez.')
              : (lang === 'en' ? 'Grab your shades & sunscreen!' : 'Güneş gözlüğünü ve kremini kap!')}
          </p>
        </div>

        {/* UV meter bar */}
        <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 border border-black rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00E676] via-[#FFE800] to-[#FF1E56] border-r border-black"
            style={{ width: `${Math.min(100, (uv / 11) * 100)}%` }}
          />
        </div>
      </div>

      {/* 2. RÜZGAR */}
      <div className="p-3.5 rounded-3xl bg-[#00E5FF] pop-card border-3 border-black flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-black">
          <div className="flex items-center gap-1 font-black text-xs text-black">
            <Wind size={15} className="text-black stroke-[2.5]" />
            <span>{t.metrics.wind}</span>
          </div>
          <span className="px-1.5 py-0.2 bg-white rounded border border-black text-[10px] font-black text-black">
            {windDirName}
          </span>
        </div>

        <div className="my-2 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-black leading-none">
              {current.windSpeed} <span className="text-xs font-sans font-bold">{lang === 'en' ? 'km/h' : 'km/s'}</span>
            </div>
            <p className="text-[11px] font-sans font-bold text-zinc-900 mt-1">
              {lang === 'en' ? 'Gusts' : 'Hamle'}: {current.windGusts} {lang === 'en' ? 'km/h' : 'km/s'}
            </p>
          </div>

          {/* Compass Dial Needle */}
          <div className="relative w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-[1.5px_1.5px_0_#000]">
            <span className="absolute top-0.5 text-[8px] font-black text-black">
              {lang === 'en' ? 'N' : 'K'}
            </span>
            <div
              className="w-1.5 h-8 rounded-full bg-transparent flex flex-col items-center justify-between transition-transform duration-500"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            >
              <div className="w-2 h-3.5 bg-[#FF1E56] border border-black rounded-t-full" />
              <div className="w-1.5 h-2.5 bg-black rounded-b-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. GÜNEŞ EĞRİSİ */}
      <div className="p-3.5 rounded-3xl bg-[#FFE800] pop-card border-3 border-black flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-black">
          <div className="flex items-center gap-1 font-black text-xs text-black">
            <Sunrise size={15} className="text-black stroke-[2.5]" />
            <span>{lang === 'en' ? 'SUN ARC' : 'GÜNEŞ EĞRİSİ'}</span>
          </div>
          <span className="text-[10px] font-black text-black">
            {isNight ? (lang === 'en' ? 'NIGHT' : 'GECE') : (lang === 'en' ? 'DAY' : 'GÜNDÜZ')}
          </span>
        </div>

        {/* Sun Horizon Graphic */}
        <div className="relative w-full h-10 flex items-center justify-center my-1">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <line x1="0" y1="36" x2="100" y2="36" stroke="#000000" strokeWidth="2" strokeDasharray="3 3" />
            <path
              d="M 5,36 Q 50,-8 95,36"
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
            />
            {!isNight ? (
              <circle
                cx={5 + sunProgress * 90}
                cy={36 - Math.sin(sunProgress * Math.PI) * 32}
                r="5"
                fill="#FF1E56"
                stroke="#000000"
                strokeWidth="2"
              />
            ) : null}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] font-sans font-bold text-black border-t border-black/20 pt-1">
          <span>{lang === 'en' ? 'Rise' : 'Doğuş'}: {today?.sunrise || '06:15'}</span>
          <span>{lang === 'en' ? 'Set' : 'Batış'}: {today?.sunset || '19:45'}</span>
        </div>
      </div>

      {/* 4. HAVA KALİTESİ */}
      <div className="p-3.5 rounded-3xl bg-[#00E676] pop-card border-3 border-black flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-black">
          <div className="flex items-center gap-1 font-black text-xs text-black">
            <Activity size={15} className="text-black stroke-[2.5]" />
            <span>{t.metrics.aqi}</span>
          </div>
          <span className="px-1.5 py-0.2 bg-white rounded border border-black text-[10px] font-black text-black">
            {data.airQuality?.aqiLevel ?? (lang === 'en' ? 'GOOD' : 'İYİ')}
          </span>
        </div>

        <div className="my-2">
          <div className="text-4xl font-black text-black leading-none">
            {data.airQuality?.aqi ?? 28} <span className="text-xs font-sans font-bold">AQI</span>
          </div>
          <p className="mt-1 text-[11px] font-sans font-bold text-black leading-tight">
            PM2.5: {data.airQuality?.pm2_5 ?? 12} µg/m³
          </p>
        </div>

        <div className="w-full h-2.5 bg-white border border-black rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#FFE800] border-r border-black"
            style={{ width: `${Math.min(100, ((data.airQuality?.aqi ?? 28) / 100) * 100)}%` }}
          />
        </div>
      </div>

      {/* 5. NEM & ÇİY NOKTASI */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-[#1C1D27] pop-card border-3 border-black flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-black dark:border-black">
          <div className="flex items-center gap-1 font-black text-xs text-black dark:text-white">
            <Droplets size={15} className="text-[#00E5FF] fill-[#00E5FF] stroke-black stroke-[2]" />
            <span>{t.metrics.humidity}</span>
          </div>
          <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400">
            {lang === 'en' ? 'DEW' : 'ÇİY'}: {dewPoint}°
          </span>
        </div>

        <div className="my-2">
          <div className="text-4xl font-black text-black dark:text-white leading-none">
            %{current.humidity}
          </div>
          <p className="mt-1 text-[11px] font-sans font-bold text-zinc-700 dark:text-zinc-300 leading-tight">
            {current.humidity > 70
              ? (lang === 'en' ? 'Quite humid and sticky!' : 'Oldukça nemli ve terletici!')
              : (lang === 'en' ? 'Crisp and balanced air.' : 'Ferah ve dengeli hava.')}
          </p>
        </div>
      </div>

      {/* 6. BASINÇ (BAROMETRE) */}
      <div className="p-3.5 rounded-3xl bg-[#FF1E56] text-white pop-card border-3 border-black flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-black">
          <div className="flex items-center gap-1 font-black text-xs text-white">
            <Gauge size={15} className="text-white stroke-[2.5]" />
            <span>{t.metrics.pressure}</span>
          </div>
          <span className="px-1.5 py-0.2 bg-[#FFE800] text-black rounded border border-black text-[10px] font-black">
            {current.pressure >= 1013 ? (lang === 'en' ? 'HIGH' : 'YÜKSEK') : (lang === 'en' ? 'LOW' : 'ALÇAK')}
          </span>
        </div>

        <div className="my-2">
          <div className="text-4xl font-black leading-none">
            {current.pressure} <span className="text-xs font-sans font-bold text-yellow-300">hPa</span>
          </div>
          <p className="mt-1 text-[11px] font-sans font-bold text-white/90 leading-tight">
            {lang === 'en' ? 'Atmospheric pressure is steady.' : 'Atmosferik basınç dengesi sağlam.'}
          </p>
        </div>
      </div>
    </section>
  );
};
