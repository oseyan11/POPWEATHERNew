import React, { useRef, useState, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import { HourlyForecastItem } from '../types/weather';
import { TrendingUp } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface TemperatureTrendChartProps {
  hourly: HourlyForecastItem[];
  convertTemp: (c: number) => number;
  isCelsius: boolean;
  lang: Language;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({
  hourly,
  convertTemp,
  isCelsius,
  lang,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(360);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [viewMetric, setViewMetric] = useState<'actual' | 'apparent' | 'both'>('actual');
  const t = translations[lang];

  const data = useMemo(() => {
    return hourly.slice(0, 24).map((item, index) => ({
      ...item,
      index,
      temp: convertTemp(item.temperature),
      apparentTemp: convertTemp(item.apparentTemperature),
    }));
  }, [hourly, convertTemp]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const height = 190;
  const margin = { top: 32, right: 16, bottom: 32, left: 16 };
  const innerWidth = Math.max(containerWidth - margin.left - margin.right, 100);
  const innerHeight = height - margin.top - margin.bottom;

  // D3 Scales
  const { xScale, yScale, minTemp, maxTemp, minItem, maxItem } = useMemo(() => {
    if (data.length === 0) {
      return {
        xScale: d3.scaleLinear().domain([0, 23]).range([0, innerWidth]),
        yScale: d3.scaleLinear().domain([0, 30]).range([innerHeight, 0]),
        minTemp: 0,
        maxTemp: 30,
        minItem: null,
        maxItem: null,
      };
    }

    const allTemps = data.flatMap((d) => [d.temp, d.apparentTemp]);
    const min = Math.min(...allTemps);
    const max = Math.max(...allTemps);
    const padding = Math.max(Math.ceil((max - min) * 0.3), 2);

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([min - padding, max + padding]).range([innerHeight, 0]);

    let minD = data[0];
    let maxD = data[0];
    for (const d of data) {
      if (d.temp < minD.temp) minD = d;
      if (d.temp > maxD.temp) maxD = d;
    }

    return {
      xScale: x,
      yScale: y,
      minTemp: min,
      maxTemp: max,
      minItem: minD,
      maxItem: maxD,
    };
  }, [data, innerWidth, innerHeight]);

  // D3 Path Generators
  const { actualPath, apparentPath, actualAreaPath } = useMemo(() => {
    const lineGenerator = d3
      .line<{ index: number; temp: number }>()
      .x((d) => xScale(d.index))
      .y((d) => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    const apparentLineGenerator = d3
      .line<{ index: number; apparentTemp: number }>()
      .x((d) => xScale(d.index))
      .y((d) => yScale(d.apparentTemp))
      .curve(d3.curveMonotoneX);

    const areaGenerator = d3
      .area<{ index: number; temp: number }>()
      .x((d) => xScale(d.index))
      .y0(innerHeight)
      .y1((d) => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    return {
      actualPath: lineGenerator(data) || '',
      apparentPath: apparentLineGenerator(data) || '',
      actualAreaPath: areaGenerator(data) || '',
    };
  }, [data, xScale, yScale, innerHeight]);

  // Pointer event handler
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = e.clientX - rect.left - margin.left;
    const clampedX = Math.max(0, Math.min(innerWidth, touchX));
    const rawIndex = xScale.invert(clampedX);
    const closestIndex = Math.max(0, Math.min(data.length - 1, Math.round(rawIndex)));
    setHoverIndex(closestIndex);
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
  };

  const activeItem = hoverIndex !== null ? data[hoverIndex] : data[0];

  return (
    <section className="mx-4 my-2 p-3.5 rounded-3xl bg-white dark:bg-[#1C1D27] pop-card border-3 border-black relative overflow-hidden">
      {/* Pop Art Ben-Day Background watermark */}
      <div className="absolute inset-0 bg-benday-dots opacity-20 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b-2 border-black dark:border-black">
        <div className="flex items-center gap-1.5 font-comic text-black dark:text-white text-sm tracking-wider font-black uppercase">
          <div className="w-5 h-5 rounded bg-[#FFE800] border border-black flex items-center justify-center">
            <TrendingUp size={13} className="text-black stroke-[3]" />
          </div>
          <span>{lang === 'en' ? 'D3 POP CHART: 24 HOURS' : 'D3 POP GRAFİK: 24 SAAT'}</span>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMetric('actual')}
            className={`px-2.5 py-0.5 rounded-lg font-comic text-xs border border-black transition-all ${
              viewMetric === 'actual'
                ? 'bg-[#FFE800] text-black font-black shadow-[1.5px_1.5px_0_#000]'
                : 'bg-white dark:bg-[#14151F] text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {lang === 'en' ? 'Temperature' : 'Sıcaklık'}
          </button>
          <button
            onClick={() => setViewMetric('both')}
            className={`px-2.5 py-0.5 rounded-lg font-comic text-xs border border-black transition-all ${
              viewMetric === 'both'
                ? 'bg-[#00E5FF] text-black font-black shadow-[1.5px_1.5px_0_#000]'
                : 'bg-white dark:bg-[#14151F] text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {lang === 'en' ? 'Compare Feels' : 'Hissedilenle Kıyasla'}
          </button>
        </div>
      </div>

      {/* Pop Art Cursor Telemetry Badge */}
      {activeItem && (
        <div className="relative z-10 mt-2 px-3 py-1.5 rounded-xl bg-[#FFE800] border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-between font-comic text-xs">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 bg-black text-white rounded text-[10px]">
              {activeItem.index === 0 ? t.hourly.now : activeItem.hour}
            </span>
            <span className="text-black font-black text-base">
              {activeItem.temp}°{isCelsius ? 'C' : 'F'}
            </span>
            {viewMetric === 'both' && (
              <span className="text-[#FF1E56] font-bold text-xs">
                ({lang === 'en' ? 'Feels: ' : 'His: '}{activeItem.apparentTemp}°)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-black font-bold">
            {activeItem.precipitationProbability > 0 && (
              <span className="px-1.5 py-0.2 bg-[#00E5FF] border border-black rounded text-[10px]">
                {lang === 'en' ? 'Rain' : 'Yağış'} %{activeItem.precipitationProbability}
              </span>
            )}
            <span className="text-[11px]">
              {activeItem.windSpeed} {lang === 'en' ? 'km/h wind' : 'km/s rüzgar'}
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas with D3 Curve and Ben-Day Patterns */}
      <div ref={containerRef} className="relative z-10 w-full mt-1 select-none touch-none">
        <svg
          width={containerWidth}
          height={height}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="cursor-crosshair overflow-visible"
        >
          <defs>
            {/* Pop Art Ben-Day Halftone Dot Pattern for the curve fill */}
            <pattern id="popBenDayArea" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#FFE800" fillOpacity="0.4" />
              <circle cx="5" cy="5" r="2.2" fill="#FF1E56" fillOpacity="0.3" />
            </pattern>
          </defs>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((ratio, idx) => {
              const y = innerHeight * ratio;
              return (
                <line
                  key={idx}
                  x1={0}
                  y1={y}
                  x2={innerWidth}
                  y2={y}
                  stroke="#000000"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.2"
                />
              );
            })}

            {/* Pop Art Area Fill under curve */}
            <path d={actualAreaPath} fill="url(#popBenDayArea)" />

            {/* Apparent Temp Line */}
            {viewMetric === 'both' && (
              <path
                d={apparentPath}
                fill="none"
                stroke="#FF1E56"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
            )}

            {/* Thick Comic Ink Black Line */}
            <path
              d={actualPath}
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Max (Peak) Comic Starburst Tag */}
            {maxItem && (
              <g transform={`translate(${xScale(maxItem.index)}, ${yScale(maxItem.temp) - 12})`}>
                <rect
                  x="-32"
                  y="-14"
                  width="64"
                  height="16"
                  rx="4"
                  fill="#FF1E56"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
                <text
                  textAnchor="middle"
                  y="-2"
                  fill="#ffffff"
                  fontSize="11"
                  fontFamily="'Bangers', cursive"
                  fontWeight="bold"
                >
                  {t.hero.peak} {maxItem.temp}°
                </text>
              </g>
            )}

            {/* Min (Low) Comic Tag */}
            {minItem && (
              <g transform={`translate(${xScale(minItem.index)}, ${yScale(minItem.temp) + 16})`}>
                <rect
                  x="-28"
                  y="-2"
                  width="56"
                  height="16"
                  rx="4"
                  fill="#00E5FF"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
                <text
                  textAnchor="middle"
                  y="10"
                  fill="#000000"
                  fontSize="11"
                  fontFamily="'Bangers', cursive"
                  fontWeight="bold"
                >
                  {t.hero.dip} {minItem.temp}°
                </text>
              </g>
            )}

            {/* X-Axis Hour Markers */}
            {data
              .filter((_, i) => i % 4 === 0 || i === data.length - 1)
              .map((d) => (
                <g key={d.index} transform={`translate(${xScale(d.index)}, ${innerHeight + 16})`}>
                  <line x1={0} y1={-6} x2={0} y2={-1} stroke="#000000" strokeWidth="1.5" />
                  <text
                    textAnchor="middle"
                    fill="#000000"
                    fontSize="10"
                    fontFamily="'Bangers', cursive"
                  >
                    {d.index === 0 ? t.hourly.now : d.hour}
                  </text>
                </g>
              ))}

            {/* Interactive Tracking Pin & Crosshair */}
            {activeItem && (
              <g transform={`translate(${xScale(activeItem.index)}, 0)`}>
                {/* Comic Hairline */}
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={innerHeight}
                  stroke="#000000"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                {/* Big Comic Dot Node */}
                <circle
                  cx={0}
                  cy={yScale(activeItem.temp)}
                  r={7}
                  fill="#FFE800"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <circle
                  cx={0}
                  cy={yScale(activeItem.temp)}
                  r={2.5}
                  fill="#FF1E56"
                />
              </g>
            )}
          </g>
        </svg>
      </div>

      <div className="mt-1 flex items-center justify-between text-[11px] font-comic text-zinc-600">
        <span>{t.chart.low}: {minTemp}°</span>
        <span className="text-black font-bold">
          {lang === 'en' ? '★ Slide finger along the curve ★' : '★ Parmağınızı eğri üzerinde gezdirin ★'}
        </span>
        <span>{t.chart.high}: {maxTemp}°</span>
      </div>
    </section>
  );
};
