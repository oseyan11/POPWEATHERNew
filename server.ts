import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// In-memory cache for weather analyses: key -> { overview, bullets, provider, timestamp }
interface CachedAnalysis {
  overview: string;
  bullets: string[];
  provider: string;
  timestamp: number;
}
const analysisCache = new Map<string, CachedAnalysis>();
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes cache per city & condition

// Initialize shared Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Supported languages
type SupportedLang = 'tr' | 'en' | 'de' | 'es' | 'fr';

// Dynamic Pop Art Intelligent Fallback Generator for all supported languages
function generatePopArtWeatherAnalysis(data: {
  city: string;
  country?: string;
  temperature: number;
  apparentTemperature: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  aqiLevel?: string;
  precipitationNext12h: number;
  minTemp24h?: number;
  maxTemp24h?: number;
  lang?: string;
}) {
  const {
    city,
    temperature,
    apparentTemperature,
    weatherDescription,
    humidity,
    windSpeed,
    uvIndex,
    aqiLevel,
    precipitationNext12h,
    minTemp24h,
    maxTemp24h,
    lang = 'tr',
  } = data;

  const isRainy = precipitationNext12h > 35;
  const isCold = temperature < 12;
  const isHot = temperature > 25;
  const isWindy = windSpeed > 25;

  let moodExclamation = 'POW!';
  if (isRainy) moodExclamation = 'SPLASH!';
  else if (isCold) moodExclamation = 'BRRR!';
  else if (isHot) moodExclamation = 'BOOM!';
  else if (isWindy) moodExclamation = 'WHOOSH!';

  let overviewText = '';
  const bullets: string[] = [];

  const highT = maxTemp24h ?? Math.round(temperature + 3);
  const lowT = minTemp24h ?? Math.round(temperature - 3);

  switch (lang) {
    case 'en': {
      if (isRainy) {
        overviewText = `${moodExclamation} Rainclouds are gathering over ${city}! Current temperature is ${temperature}°C, feeling like ${apparentTemperature}°C with a %${precipitationNext12h} rain probability. A vivid comic book sky invites you to pop that umbrella!`;
        bullets.push('Outfit: A waterproof Pop Art raincoat and bright boots are your best bet today!');
        bullets.push(`Rain Alert: %${precipitationNext12h} chance of showers ahead, don't leave your umbrella behind.`);
      } else if (isCold) {
        overviewText = `${moodExclamation} Mercury drops to ${temperature}°C in ${city}! Feels like ${apparentTemperature}°C with a crisp Roy Lichtenstein vibe. Grab a steaming mug of hot coffee and savor the streets!`;
        bullets.push('Outfit: Layer up with a vintage knit sweater, warm scarf and bold sneakers.');
        bullets.push(`Daily Range: High of ${highT}°C, low of ${lowT}°C. Stay warm outdoors.`);
      } else if (isHot) {
        overviewText = `${moodExclamation} ${city} is radiating in bright Andy Warhol shades! It is ${temperature}°C, feeling like ${apparentTemperature}°C. Solar vibes are peaking, strap on your shades and burst outside!`;
        bullets.push('Outfit: Breathable cotton tee, retro sunglasses and plenty of cold drinks!');
        bullets.push(`UV Check: UV index is ${uvIndex}/11. Sunscreen is essential under midday skies.`);
      } else {
        overviewText = `${moodExclamation} Pure Pop Art atmosphere over ${city}! It is ${temperature}°C, ${weatherDescription.toLowerCase()} with a sweet breeze (${windSpeed} km/h). A prime moment to catch the rhythm of the city!`;
        bullets.push('Outfit: A lightweight jacket and classic denim will nail your street style.');
        bullets.push(isWindy ? `Breeze Check: ${windSpeed} km/h gusts are swirling.` : `Daily Range: High of ${highT}°C, low of ${lowT}°C.`);
      }
      bullets.push(`Air & Solar: Air quality is ${aqiLevel || 'Good'}, UV index is ${uvIndex}/11. Humidity at %${humidity}.`);
      break;
    }

    case 'de': {
      if (isRainy) {
        overviewText = `${moodExclamation} Regenwolken ziehen über ${city} auf! Aktuell sind es ${temperature}°C (gefühlt ${apparentTemperature}°C) bei %${precipitationNext12h} Regenwahrscheinlichkeit. Schirm auf und los gehts!`;
        bullets.push('Outfit: Wasserdichte Pop Art Regenjacke und bunte Stiefel.');
        bullets.push(`Regenwarnung: %${precipitationNext12h} Regenrisiko in den nächsten Stunden.`);
      } else if (isCold) {
        overviewText = `${moodExclamation} Die Temperaturen in ${city} sinken auf ${temperature}°C (gefühlt ${apparentTemperature}°C)! Ein frischer Lichtenstein-Look für die Stadt. Heißer Kaffee in die Hand und Straßen erkunden!`;
        bullets.push('Outfit: Strickpullover, warmer Schal und stylische Sneaker.');
        bullets.push(`Temperaturspanne: Max ${highT}°C, Min ${lowT}°C. Warm anziehen!`);
      } else if (isHot) {
        overviewText = `${moodExclamation} ${city} leuchtet in strahlenden Warhol-Farben! ${temperature}°C, gefühlt ${apparentTemperature}°C. Sonnenbrille auf und das Pop Art Wetter genießen!`;
        bullets.push('Outfit: Leichtes T-Shirt, Sonnenbrille und viel kaltes Wasser.');
        bullets.push(`UV-Index: ${uvIndex}/11. Sonnenschutz nicht vergessen.`);
      } else {
        overviewText = `${moodExclamation} Reines Pop Art Wetter über ${city}! Es hat ${temperature}°C, ${weatherDescription.toLowerCase()} bei sanftem Wind (${windSpeed} km/h). Perfekt für einen Spaziergang!`;
        bullets.push('Outfit: Leichte Jacke und lässige Jeans für die City.');
        bullets.push(`Temperaturverlauf: Hoch ${highT}°C, Tief ${lowT}°C. Schöner Tag!`);
      }
      bullets.push(`Luft & Umwelt: Luftqualität ${aqiLevel || 'Gut'}, UV-Index ${uvIndex}/11, Feuchte %${humidity}.`);
      break;
    }

    case 'es': {
      if (isRainy) {
        overviewText = `${moodExclamation} ¡Nubes de lluvia sobre ${city}! Temperatura de ${temperature}°C (sensación ${apparentTemperature}°C) con un %${precipitationNext12h} de probabilidad de lluvia. ¡Abre tu paraguas Pop Art!`;
        bullets.push('Outfit: Chubasquero colorido y botas listas para el agua.');
        bullets.push(`Alerta de Lluvia: %${precipitationNext12h} probabilidad de chubascos.`);
      } else if (isCold) {
        overviewText = `${moodExclamation} ¡El termómetro marca ${temperature}°C en ${city} (sensación ${apparentTemperature}°C)! Un ambiente fresco estilo Lichtenstein. ¡Café caliente y a disfrutar!`;
        bullets.push('Outfit: Jersey vintage de punto, bufanda y zapatillas.');
        bullets.push(`Rango Térmico: Máxima de ${highT}°C, mínima de ${lowT}°C.`);
      } else if (isHot) {
        overviewText = `${moodExclamation} ¡${city} brilla con toda la energía Pop Art de Warhol! ${temperature}°C (sensación ${apparentTemperature}°C). ¡Gafas de sol y a la calle!`;
        bullets.push('Outfit: Camiseta fresca, gafas de sol y mucha hidratación.');
        bullets.push(`Índice UV: ${uvIndex}/11. Protección solar recomendada.`);
      } else {
        overviewText = `${moodExclamation} ¡Ambiente Pop Art absoluto en ${city}! Hay ${temperature}°C, ${weatherDescription.toLowerCase()} y una brisa de ${windSpeed} km/h. ¡Momento perfecto para salir!`;
        bullets.push('Outfit: Chaqueta ligera y vaqueros clásicos.');
        bullets.push(`Temperaturas: Máx ${highT}°C, Mín ${lowT}°C. Día agradable.`);
      }
      bullets.push(`Aire y Sol: Calidad del aire ${aqiLevel || 'Buena'}, UV ${uvIndex}/11, Humedad %${humidity}.`);
      break;
    }

    case 'fr': {
      if (isRainy) {
        overviewText = `${moodExclamation} Des nuages de pluie se rassemblent sur ${city} ! Il fait ${temperature}°C (ressenti ${apparentTemperature}°C) avec %${precipitationNext12h} de risque de pluie. Sortez votre parapluie Pop Art !`;
        bullets.push('Outfit : Imperméable Pop Art coloré et bottes imperméables.');
        bullets.push(`Alerte Pluie : %${precipitationNext12h} de probabilité d'averses.`);
      } else if (isCold) {
        overviewText = `${moodExclamation} Le mercure affiche ${temperature}°C à ${city} (ressenti ${apparentTemperature}°C) dans une ambiance fraîche à la Lichtenstein. Un café chaud et profitez de la ville !`;
        bullets.push('Outfit : Pull en maille rétro, écharpe douce et baskets confortables.');
        bullets.push(`Écart Thermique : Max ${highT}°C, Min ${lowT}°C.`);
      } else if (isHot) {
        overviewText = `${moodExclamation} ${city} rayonne aux couleurs vives d'Andy Warhol ! ${temperature}°C (ressenti ${apparentTemperature}°C). Lunettes de soleil et énergie Pop Art !`;
        bullets.push('Outfit : T-shirt léger, lunettes de soleil et bonne hydratation.');
        bullets.push(`Indice UV : ${uvIndex}/11. Crème solaire conseillée.`);
      } else {
        overviewText = `${moodExclamation} Atmosphère 100% Pop Art sur ${city} ! Il fait ${temperature}°C, ciel ${weatherDescription.toLowerCase()} avec un vent doux (${windSpeed} km/h). Moment parfait pour sortir !`;
        bullets.push('Outfit : Veste légère et denim classique pour la rue.');
        bullets.push(`Températures : Haut ${highT}°C, Bas ${lowT}°C.`);
      }
      bullets.push(`Air & Climat : Qualité de l'air ${aqiLevel || 'Bonne'}, UV ${uvIndex}/11, Humidité %${humidity}.`);
      break;
    }

    default: {
      // Turkish (Default)
      if (isRainy) {
        overviewText = `${moodExclamation} ${city} üzerinde bulutlar toplanıyor! Sıcaklık ${temperature}°C, hissedilen ${apparentTemperature}°C. Önümüzdeki saatlerde %${precipitationNext12h} yağış ihtimali var; çizgi roman renkleriyle dolu gökyüzü şemsiyeleri açmaya çağırıyor!`;
        bullets.push('Kombin: Su geçirmez Pop Art bir yağmurluk ve sarı çizmeler tam sana göre!');
        bullets.push(`Yağış Uyarısı: Gelecek saatlerde %${precipitationNext12h} olasılıkla yağmur seni bekliyor, şemsiyeni sakın unutma.`);
      } else if (isCold) {
        overviewText = `${moodExclamation} ${city} semalarında cıva ${temperature}°C'ye çekilmiş durumda! Hissedilen sıcaklık ${apparentTemperature}°C ile serin bir Lichtenstein karesi sunuyor. Sıcacık bir kahveyle sokakların tadını çıkar!`;
        bullets.push('Kombin: Kat kat retro bir hırka, vintage atkı ve sıcak tutan kalın sneakerlar.');
        bullets.push(`Günün Seyri: Zirve ${highT}°C, en düşük ${lowT}°C. Sıkı giyinmeyi unutma.`);
      } else if (isHot) {
        overviewText = `${moodExclamation} ${city} adeta Andy Warhol'un en parlak renkleri gibi parıldıyor! Sıcaklık ${temperature}°C ve hissedilen ${apparentTemperature}°C. Güneş enerjisi tavan yaptı, gözlükleri takıp dışarı fırlama zamanı!`;
        bullets.push('Kombin: Renkli pamuklu tişört, güneş gözlüğü ve bol bol su tüketimi!');
        bullets.push(`Güneş & UV: UV indeksi ${uvIndex}/11 seviyesinde. Güneş kremini ihmal etme.`);
      } else {
        overviewText = `${moodExclamation} ${city} semalarında tam bir pop art havası hakim! Sıcaklık ${temperature}°C, hava ${weatherDescription.toLowerCase()} ve rüzgar tatlı bir esintiyle (${windSpeed} km/s) esiyor. Dışarı çıkıp günün ritmini yakalamak için kusursuz bir an!`;
        bullets.push('Kombin: Hafif bir ceket ve kot pantolonla sokak stilin hazır.');
        bullets.push(isWindy ? `Rüzgar Durumu: ${windSpeed} km/s hızındaki rüzgar saçları uçurabilir.` : `Günün Seyri: Zirve ${highT}°C, en düşük ${lowT}°C.`);
      }
      bullets.push(`Hava & UV: Hava kalitesi ${aqiLevel || 'İyi'}, UV indeksi ${uvIndex}/11. Nem oranı %${humidity}.`);
      break;
    }
  }

  return {
    overview: overviewText,
    bullets,
    provider: 'pop-art-intelligence',
  };
}

// Helper to determine language prompt requirements
function buildGeminiPrompt(data: {
  city: string;
  country: string;
  temperature: number;
  apparentTemperature: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  aqiLevel: string;
  precipitationNext12h: number;
  minTemp24h: number;
  maxTemp24h: number;
  lang: string;
}): string {
  const {
    city,
    country,
    temperature,
    apparentTemperature,
    weatherDescription,
    humidity,
    windSpeed,
    pressure,
    uvIndex,
    aqiLevel,
    precipitationNext12h,
    minTemp24h,
    maxTemp24h,
    lang,
  } = data;

  const langNames: Record<string, string> = {
    tr: 'Turkish',
    en: 'English',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
  };
  const targetLanguage = langNames[lang] || 'English';

  return `You are an AI meteorologist with the spirit, wit, and vibrant punch of Roy Lichtenstein & Andy Warhol Pop Art comic books.
Deeply analyze this LIVE and REAL meteorological data:

- Location: ${city}, ${country}
- Current Temp: ${temperature}°C
- Feels Like: ${apparentTemperature}°C
- Condition: ${weatherDescription}
- Humidity: %${humidity}
- Wind Speed: ${windSpeed} km/h
- Pressure: ${pressure} hPa
- UV Index: ${uvIndex} (out of 11)
- Air Quality: ${aqiLevel || 'Normal'}
- Peak Rain Probability Next 12h: %${precipitationNext12h}
- Daily Temperature Range: ${minTemp24h}°C - ${maxTemp24h}°C

CRITICAL INSTRUCTIONS:
- You MUST write the entire output in ${targetLanguage.toUpperCase()}.
- "overview": Write 2-3 vibrant, immersive, and witty Pop Art comic commentary sentences (use comic exclamation effects like POW!, BAM!, WOW!, SPLASH!).
- "bullets": 3 punchy tips (1: pop outfit recommendation, 2: rain/wind advice, 3: air quality / outdoor recommendation).

Respond strictly adhering to the JSON schema.`;
}

// API endpoint for Gemini AI weather overview with multi-tier model fallback and caching
app.post('/api/weather-analysis', async (req, res) => {
  const {
    city = 'İstanbul',
    country = 'Türkiye',
    temperature = 20,
    apparentTemperature = 20,
    weatherDescription = 'Açık',
    humidity = 50,
    windSpeed = 10,
    pressure = 1013,
    uvIndex = 3,
    aqiLevel = 'İyi',
    precipitationNext12h = 0,
    minTemp24h = 15,
    maxTemp24h = 24,
    lang = 'tr',
  } = req.body;

  // 1. Check in-memory cache
  const cacheKey = `${city.toLowerCase()}_${Math.round(temperature)}_${Math.round(precipitationNext12h)}_${lang}`;
  const cached = analysisCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json({
      overview: cached.overview,
      bullets: cached.bullets,
      provider: cached.provider,
    });
  }

  // 2. If no Gemini client is configured, return the high-quality local meteorological intelligence
  if (!ai) {
    const fallback = generatePopArtWeatherAnalysis({ ...req.body, lang });
    analysisCache.set(cacheKey, { ...fallback, timestamp: Date.now() });
    return res.json(fallback);
  }

  const prompt = buildGeminiPrompt({
    city,
    country,
    temperature,
    apparentTemperature,
    weatherDescription,
    humidity,
    windSpeed,
    pressure,
    uvIndex,
    aqiLevel,
    precipitationNext12h,
    minTemp24h,
    maxTemp24h,
    lang,
  });

  const weatherJsonSchema = {
    type: Type.OBJECT,
    properties: {
      overview: {
        type: Type.STRING,
        description: 'Vibrant 2-3 sentence Pop Art comic style weather overview',
      },
      bullets: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: '3 punchy tips for outfit, rain/wind, and outdoor health',
      },
    },
    required: ['overview', 'bullets'],
  };

  // Tiered model cascade: 'gemini-3.8-flash' -> 'gemini-3.1-flash-lite'
  const modelsToTry = [
    { name: 'gemini-3.8-flash', thinkingLevel: ThinkingLevel.LOW },
    { name: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
  ];

  let parsedResult: { overview?: string; bullets?: string[] } | null = null;
  let successfulProvider = 'gemini';

  for (const modelConfig of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelConfig.name,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: weatherJsonSchema,
          thinkingConfig: {
            thinkingLevel: modelConfig.thinkingLevel,
          },
        },
      });

      const responseText = response?.text?.trim() || '';
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed.overview && Array.isArray(parsed.bullets) && parsed.bullets.length > 0) {
          parsedResult = parsed;
          successfulProvider = modelConfig.name === 'gemini-3.8-flash' ? 'gemini' : 'gemini-lite';
          break;
        }
      }
    } catch {
      // If a model is unavailable (503 high demand), rate-limited (429), or transiently busy,
      // silently proceed to the next model candidate in the pool without polluting stdout/stderr
      continue;
    }
  }

  if (parsedResult?.overview) {
    const finalResult = {
      overview: parsedResult.overview,
      bullets: parsedResult.bullets || [],
      provider: successfulProvider,
    };
    analysisCache.set(cacheKey, { ...finalResult, timestamp: Date.now() });
    return res.json(finalResult);
  }

  // 4. Smooth fallback to our deterministic Pop Art intelligence engine
  const fallbackResult = generatePopArtWeatherAnalysis({ ...req.body, lang });
  analysisCache.set(cacheKey, { ...fallbackResult, timestamp: Date.now() });
  return res.json(fallbackResult);
});

// Vite Middleware for Dev / Static Files for Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Pop Art Weather Server running on http://0.0.0.0:${port}`);
  });
}

startServer();

