import { Coordinates, WeatherData, HourlyForecastItem, DailyForecastItem, AirQualityData } from '../types/weather';

export const POPULAR_CITIES: Coordinates[] = [
  { name: 'İstanbul', country: 'Türkiye', lat: 41.0082, lon: 28.9784, admin1: 'Marmara' },
  { name: 'Ankara', country: 'Türkiye', lat: 39.9334, lon: 32.8597, admin1: 'İç Anadolu' },
  { name: 'İzmir', country: 'Türkiye', lat: 38.4192, lon: 27.1287, admin1: 'Ege' },
  { name: 'Antalya', country: 'Türkiye', lat: 36.8969, lon: 30.7133, admin1: 'Akdeniz' },
  { name: 'Londra', country: 'Birleşik Krallık', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japonya', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'ABD', lat: 40.7128, lon: -74.006 },
  { name: 'Berlin', country: 'Almanya', lat: 52.52, lon: 13.405 },
  { name: 'Paris', country: 'Fransa', lat: 48.8566, lon: 2.3522 },
  { name: 'Dubai', country: 'BAE', lat: 25.2048, lon: 55.2708 },
];

const SAVED_CITIES_STORAGE_KEY = 'kara_weather_saved_cities';
const LAST_SELECTED_CITY_KEY = 'kara_weather_selected_city';

export function getSavedCities(): Coordinates[] {
  try {
    const raw = localStorage.getItem(SAVED_CITIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return POPULAR_CITIES.slice(0, 4);
}

export function saveCity(city: Coordinates): Coordinates[] {
  const current = getSavedCities();
  const exists = current.some(
    (c) => Math.abs(c.lat - city.lat) < 0.05 && Math.abs(c.lon - city.lon) < 0.05
  );
  if (!exists) {
    const updated = [city, ...current];
    try {
      localStorage.setItem(SAVED_CITIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }
  return current;
}

export function removeSavedCity(lat: number, lon: number): Coordinates[] {
  const current = getSavedCities();
  const filtered = current.filter(
    (c) => !(Math.abs(c.lat - lat) < 0.05 && Math.abs(c.lon - lon) < 0.05)
  );
  try {
    localStorage.setItem(SAVED_CITIES_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
  return filtered;
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<{ name: string; country: string; admin1?: string }> {
  // 1. Try BigDataCloud free client reverse geocoding
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=tr`
    );
    if (res.ok) {
      const data = await res.json();
      const city =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        data.localityInfo?.administrative?.[2]?.name;
      if (city && city.trim().length > 0) {
        return {
          name: city.trim(),
          country: data.countryName || 'Türkiye',
          admin1: data.principalSubdivision || '',
        };
      }
    }
  } catch {
    // fallback
  }

  // 2. Try OpenStreetMap Nominatim reverse
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12&addressdetails=1&accept-language=tr`
    );
    if (res.ok) {
      const data = await res.json();
      const name =
        data.address?.city ||
        data.address?.town ||
        data.address?.district ||
        data.address?.province ||
        data.address?.county ||
        data.name;
      if (name && name.trim().length > 0) {
        return {
          name: name.trim(),
          country: data.address?.country || 'Türkiye',
          admin1: data.address?.province || data.address?.state || '',
        };
      }
    }
  } catch {
    // fallback
  }

  // 3. Fallback to closest popular city
  let closest = POPULAR_CITIES[0];
  let minD = Infinity;
  for (const c of POPULAR_CITIES) {
    const d = Math.hypot(c.lat - lat, c.lon - lon);
    if (d < minD) {
      minD = d;
      closest = c;
    }
  }

  return {
    name: closest.name,
    country: closest.country || 'Türkiye',
    admin1: closest.admin1,
  };
}

export function getLastSelectedCity(): Coordinates {
  try {
    const raw = localStorage.getItem(LAST_SELECTED_CITY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return POPULAR_CITIES[0];
}

export function setLastSelectedCity(city: Coordinates): void {
  try {
    localStorage.setItem(LAST_SELECTED_CITY_KEY, JSON.stringify(city));
  } catch {
    // ignore
  }
}

export async function fetchLiveWeather(coord: Coordinates): Promise<WeatherData> {
  // If city name is missing or placeholder "Mevcut Konumum", resolve the real city name via reverse geocoding
  let resolvedName = coord.name;
  let resolvedCountry = coord.country || 'Türkiye';
  let resolvedAdmin1 = coord.admin1;

  if (!resolvedName || resolvedName.toLowerCase().includes('mevcut') || resolvedName.toLowerCase().includes('konum')) {
    try {
      const geo = await reverseGeocode(coord.lat, coord.lon);
      resolvedName = geo.name;
      resolvedCountry = geo.country;
      resolvedAdmin1 = geo.admin1;
      coord.name = geo.name;
      coord.country = geo.country;
      coord.admin1 = geo.admin1;
    } catch {
      resolvedName = 'İstanbul';
    }
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coord.lat}&longitude=${coord.lon}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone`;

  const [weatherRes, airRes] = await Promise.allSettled([
    fetch(url),
    fetch(airQualityUrl),
  ]);

  if (weatherRes.status !== 'fulfilled' || !weatherRes.value.ok) {
    throw new Error('Hava durumu verisi alınamadı. Lütfen internet bağlantınızı kontrol edin.');
  }

  const weatherJson = await weatherRes.value.json();
  let airQualityData: AirQualityData | undefined = undefined;

  if (airRes.status === 'fulfilled' && airRes.value.ok) {
    try {
      const airJson = await airRes.value.json();
      const aqiValue = Math.round(airJson.current?.european_aqi ?? 30);
      let level: AirQualityData['aqiLevel'] = 'İyi';
      if (aqiValue <= 20) level = 'Çok İyi';
      else if (aqiValue <= 40) level = 'İyi';
      else if (aqiValue <= 60) level = 'Orta';
      else if (aqiValue <= 80) level = 'Kötü';
      else level = 'Çok Kötü';

      airQualityData = {
        aqi: aqiValue,
        aqiLevel: level,
        pm2_5: Math.round(airJson.current?.pm2_5 ?? 12),
        pm10: Math.round(airJson.current?.pm10 ?? 24),
        no2: Math.round(airJson.current?.nitrogen_dioxide ?? 15),
        so2: Math.round(airJson.current?.sulphur_dioxide ?? 5),
        o3: Math.round(airJson.current?.ozone ?? 45),
      };
    } catch {
      // air quality is optional
    }
  }

  // Parse Hourly data: next 24-36 hours starting from current local hour
  const hourlyTimes: string[] = weatherJson.hourly?.time || [];
  const currentLocalHour = weatherJson.current?.time ? weatherJson.current.time.slice(0, 13) : '';
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(currentLocalHour));
  if (startIndex === -1) {
    const nowLocalHour = new Date().toISOString().slice(0, 13);
    startIndex = hourlyTimes.findIndex((t) => t.startsWith(nowLocalHour));
  }
  if (startIndex === -1) startIndex = 0;

  const hourlyItems: HourlyForecastItem[] = [];
  const maxHourlyCount = 28;
  for (let i = startIndex; i < Math.min(startIndex + maxHourlyCount, hourlyTimes.length); i++) {
    const rawTime = hourlyTimes[i];
    const dateObj = new Date(rawTime);
    const hourLabel = i === startIndex ? 'Şimdi' : `${dateObj.getHours().toString().padStart(2, '0')}:00`;

    hourlyItems.push({
      time: rawTime,
      hour: hourLabel,
      temperature: Math.round(weatherJson.hourly.temperature_2m[i] ?? 0),
      apparentTemperature: Math.round(weatherJson.hourly.apparent_temperature[i] ?? 0),
      weatherCode: weatherJson.hourly.weather_code[i] ?? 0,
      precipitationProbability: Math.round(weatherJson.hourly.precipitation_probability[i] ?? 0),
      precipitation: Number((weatherJson.hourly.precipitation[i] ?? 0).toFixed(1)),
      windSpeed: Math.round(weatherJson.hourly.wind_speed_10m[i] ?? 0),
      windDirection: Math.round(weatherJson.hourly.wind_direction_10m[i] ?? 0),
      humidity: Math.round(weatherJson.hourly.relative_humidity_2m[i] ?? 50),
      uvIndex: Math.round(weatherJson.hourly.uv_index[i] ?? 0),
      isDay: weatherJson.hourly.is_day[i] === 1,
    });
  }

  // Parse Daily data (10-day forecast)
  const dailyTimes: string[] = weatherJson.daily?.time || [];
  const dailyItems: DailyForecastItem[] = [];
  const turkishDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  for (let i = 0; i < dailyTimes.length; i++) {
    const dDate = new Date(dailyTimes[i]);
    let dayName = turkishDays[dDate.getDay()];
    if (i === 0) dayName = 'Bugün';
    else if (i === 1) dayName = 'Yarın';

    dailyItems.push({
      date: dailyTimes[i],
      dayName,
      weatherCode: weatherJson.daily.weather_code[i] ?? 0,
      temperatureMax: Math.round(weatherJson.daily.temperature_2m_max[i] ?? 0),
      temperatureMin: Math.round(weatherJson.daily.temperature_2m_min[i] ?? 0),
      apparentMax: Math.round(weatherJson.daily.apparent_temperature_max[i] ?? 0),
      apparentMin: Math.round(weatherJson.daily.apparent_temperature_min[i] ?? 0),
      precipitationProbability: Math.round(weatherJson.daily.precipitation_probability_max[i] ?? 0),
      precipitationSum: Number((weatherJson.daily.precipitation_sum[i] ?? 0).toFixed(1)),
      windSpeedMax: Math.round(weatherJson.daily.wind_speed_10m_max[i] ?? 0),
      uvIndexMax: Math.round(weatherJson.daily.uv_index_max[i] ?? 0),
      sunrise: weatherJson.daily.sunrise[i] ? weatherJson.daily.sunrise[i].slice(11, 16) : '06:00',
      sunset: weatherJson.daily.sunset[i] ? weatherJson.daily.sunset[i].slice(11, 16) : '19:30',
    });
  }

  // Calculate current UV index from current hour's hourly value
  const currentUV = hourlyItems[0]?.uvIndex ?? 0;

  return {
    city: coord.name,
    country: coord.country || '',
    coordinates: coord,
    current: {
      temperature: Math.round(weatherJson.current.temperature_2m ?? 0),
      apparentTemperature: Math.round(weatherJson.current.apparent_temperature ?? 0),
      weatherCode: weatherJson.current.weather_code ?? 0,
      isDay: weatherJson.current.is_day === 1,
      windSpeed: Math.round(weatherJson.current.wind_speed_10m ?? 0),
      windDirection: Math.round(weatherJson.current.wind_direction_10m ?? 0),
      windGusts: Math.round(weatherJson.current.wind_gusts_10m ?? 0),
      humidity: Math.round(weatherJson.current.relative_humidity_2m ?? 0),
      pressure: Math.round(weatherJson.current.pressure_msl ?? 1013),
      uvIndex: currentUV,
      precipitation: Number((weatherJson.current.precipitation ?? 0).toFixed(1)),
      cloudCover: Math.round(weatherJson.current.cloud_cover ?? 0),
      time: weatherJson.current.time,
    },
    hourly: hourlyItems,
    daily: dailyItems,
    airQuality: airQualityData,
    lastUpdated: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

export async function searchCities(query: string): Promise<Coordinates[]> {
  if (!query || query.trim().length < 2) return [];
  const trimmed = query.trim();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=tr&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r: { name: string; country?: string; admin1?: string; latitude: number; longitude: number }) => ({
      name: r.name,
      country: r.country || '',
      admin1: r.admin1 || '',
      lat: r.latitude,
      lon: r.longitude,
    }));
  } catch {
    return [];
  }
}
