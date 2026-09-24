import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { Sparkles, RefreshCw, Zap } from 'lucide-react';
import { Language, translations, getLocalizedCondition } from '../services/i18n';

interface GrokWeatherInsightProps {
  data: WeatherData;
  isCelsius: boolean;
  convertTemp: (c: number) => number;
  lang: Language;
}

interface AIAnalysisResult {
  overview: string;
  bullets: string[];
  provider?: string;
}

// Client-side cache to minimize API calls during rapid tab switching
const clientCache = new Map<string, AIAnalysisResult>();

export const GrokWeatherInsight: React.FC<GrokWeatherInsightProps> = ({
  data,
  isCelsius,
  convertTemp,
  lang,
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = translations[lang];

  const fetchAIAnalysis = async (forceRefresh = false) => {
    const next12Hours = data.hourly.slice(0, 12);
    const maxRainProb = Math.max(...next12Hours.map((h) => h.precipitationProbability), 0);
    const minTemp = Math.min(...next12Hours.map((h) => h.temperature));
    const maxTemp = Math.max(...next12Hours.map((h) => h.temperature));
    const condition = getLocalizedCondition(data.current.weatherCode, lang).label;

    const cacheKey = `${data.city.toLowerCase()}_${Math.round(data.current.temperature)}_${data.current.weatherCode}_${lang}`;

    if (!forceRefresh && clientCache.has(cacheKey)) {
      setAnalysis(clientCache.get(cacheKey)!);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/weather-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: data.city,
          country: data.country,
          temperature: data.current.temperature,
          apparentTemperature: data.current.apparentTemperature,
          weatherDescription: condition,
          humidity: data.current.humidity,
          windSpeed: data.current.windSpeed,
          pressure: data.current.pressure,
          uvIndex: data.current.uvIndex,
          aqiLevel: data.airQuality?.aqiLevel || 'İyi',
          precipitationNext12h: maxRainProb,
          minTemp24h: minTemp,
          maxTemp24h: maxTemp,
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error('AI analysis could not be retrieved');
      }

      const json = await response.json();
      if (json.overview) {
        clientCache.set(cacheKey, json);
        setAnalysis(json);
      } else {
        throw new Error('Incomplete AI response');
      }
    } catch {
      // Deterministic real-data fallback based on current live sensor readings & language
      const fallbackOverview =
        lang === 'en'
          ? `POW! In ${data.city}, the temperature is ${data.current.temperature}°C (feels like ${data.current.apparentTemperature}°C) under ${condition.toLowerCase()} skies. ${
              maxRainProb > 30
                ? `Showers possible with a %${maxRainProb} rain probability over coming hours, keep your umbrella close!`
                : 'No immediate rain risk ahead, great time for outdoor vibes.'
            }`
          : `${data.city} atmosferinde anlık sıcaklık ${data.current.temperature}°C (hissedilen ${data.current.apparentTemperature}°C) ve gökyüzü ${condition.toLowerCase()}. ${
              maxRainProb > 30
                ? `Önümüzdeki saatlerde %${maxRainProb} oranında yağış olasılığı var, tedbirli olun!`
                : 'Yakın vadede yağış riski bulunmuyor, açık hava aktiviteleri için uygun.'
            }`;

      const fallbackResult: AIAnalysisResult = {
        overview: fallbackOverview,
        bullets:
          lang === 'en'
            ? [
                `Outfit: ${data.current.temperature < 15 ? 'Layered warm jacket and scarf recommended.' : 'Casual lightweight layers are perfect.'}`,
                maxRainProb > 30 ? 'Keep a stylish umbrella handy.' : 'No rain expected, enjoy the clear skies.',
                `Air Quality: ${data.airQuality?.aqiLevel || 'Normal'} (AQI: ${data.airQuality?.aqi || '30'})`,
              ]
            : [
                `Giyim: ${data.current.temperature < 15 ? 'Katmanlı kalın kıyafetler ve rüzgarlık önerilir.' : 'Hafif ve rahat kıyafetler yeterli.'}`,
                maxRainProb > 30 ? 'Şemsiyenizi yanınızda bulundurmanızda fayda var.' : 'Yağmur riski bulunmuyor.',
                `Hava Kalitesi: ${data.airQuality?.aqiLevel || 'Normal'} (AQI: ${data.airQuality?.aqi || '30'})`,
              ],
        provider: 'pop-art-ai',
      };

      clientCache.set(cacheKey, fallbackResult);
      setAnalysis(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis(false);
  }, [data.city, data.current.temperature, data.current.weatherCode, lang]);

  return (
    <div className="mx-4 my-2 p-4 rounded-3xl bg-[#FFFDF0] dark:bg-[#181924] pop-card border-3 border-black relative overflow-hidden font-comic">
      {/* Background Halftone corner */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-benday-dots-yellow opacity-40 pointer-events-none" />

      {/* AI Overview Header */}
      <div className="flex items-center justify-between pb-2.5 border-b-2 border-black dark:border-black relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FFE800] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0_#000]">
            <Sparkles size={14} className="text-black fill-black" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wider uppercase text-black dark:text-white leading-none">
              {t.ai.title}
            </h3>
            <span className="text-[10px] font-sans font-bold text-zinc-600 dark:text-zinc-400">
              {t.ai.subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-[#FF1E56] text-white border border-black rounded-lg text-[9px] font-black tracking-wider">
            {analysis?.provider === 'gemini'
              ? 'GEMINI 3.8'
              : analysis?.provider === 'gemini-lite'
              ? 'GEMINI LITE'
              : 'POP ART AI'}
          </span>
          <button
            onClick={() => fetchAIAnalysis(true)}
            disabled={isLoading}
            className="w-7 h-7 rounded-lg bg-white dark:bg-[#252736] border border-black flex items-center justify-center pop-btn shadow-[1.5px_1.5px_0_#000] disabled:opacity-50"
            title={t.ai.refreshTooltip}
          >
            <RefreshCw size={12} className={`text-black dark:text-white stroke-[2.5] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-3 space-y-3 relative z-10">
        {isLoading && !analysis ? (
          <div className="p-4 bg-[#FFE800]/30 border-2 border-dashed border-black rounded-2xl flex items-center justify-center gap-2">
            <Zap size={16} className="text-[#FF1E56] fill-[#FF1E56] animate-bounce" />
            <span className="text-xs font-black text-black dark:text-white">
              {t.ai.analyzing}
            </span>
          </div>
        ) : (
          <>
            {/* Pop Art Speech Bubble Card */}
            <div className="p-3.5 bg-[#FFE800] border-2 border-black rounded-2xl shadow-[3px_3px_0_#000] relative">
              <p className="font-sans font-bold text-xs text-black leading-relaxed">
                {analysis?.overview}
              </p>
            </div>

            {/* AI Generated Bullet Points */}
            {analysis?.bullets && analysis.bullets.length > 0 && (
              <div className="space-y-1.5">
                {analysis.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-xl bg-white dark:bg-[#202230] border border-black shadow-[1.5px_1.5px_0_#000]"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#00E5FF] border border-black flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={10} className="fill-black text-black" />
                    </div>
                    <span className="text-[11px] font-sans font-bold text-black dark:text-white leading-snug">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Live Sensor Quick Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 font-comic text-[10px]">
              <span className="px-2 py-0.5 bg-white dark:bg-[#202230] border border-black rounded-lg shadow-[1.5px_1.5px_0_#000] text-black dark:text-white">
                {t.ai.pressure}: {data.current.pressure} hPa
              </span>
              <span className="px-2 py-0.5 bg-[#00E676] border border-black rounded-lg shadow-[1.5px_1.5px_0_#000] text-black">
                {t.ai.aqi}: {data.airQuality ? `${data.airQuality.aqi} (${data.airQuality.aqiLevel})` : t.ai.good}
              </span>
              <span className="px-2 py-0.5 bg-[#FF1E56] text-white border border-black rounded-lg shadow-[1.5px_1.5px_0_#000]">
                {t.ai.uv}: {data.current.uvIndex}
              </span>
              <span className="px-2 py-0.5 bg-[#00E5FF] border border-black rounded-lg shadow-[1.5px_1.5px_0_#000] text-black">
                {t.ai.humidity}: %{data.current.humidity}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
