export interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  humidity: number;
  pressure: number;
  uvIndex: number;
  precipitation: number;
  cloudCover: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  hour: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface AirQualityData {
  aqi: number;
  aqiLevel: 'Çok İyi' | 'İyi' | 'Orta' | 'Kötü' | 'Çok Kötü';
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
}

export interface WeatherData {
  city: string;
  country: string;
  coordinates: Coordinates;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  lastUpdated: string;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  isRain: boolean;
  isSnow: boolean;
  isThunder: boolean;
  isClear: boolean;
  isCloudy: boolean;
}

export const WMO_CODES: Record<number, WeatherConditionInfo> = {
  0: { label: 'Açık', description: 'Gökyüzü tamamen berrak', iconName: 'Sun', isRain: false, isSnow: false, isThunder: false, isClear: true, isCloudy: false },
  1: { label: 'Çoğunlukla Açık', description: 'Hafif seyrek bulutlar', iconName: 'SunMedium', isRain: false, isSnow: false, isThunder: false, isClear: true, isCloudy: false },
  2: { label: 'Parçalı Bulutlu', description: 'Güneşli ve parçalı bulut geçişleri', iconName: 'CloudSun', isRain: false, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  3: { label: 'Kapalı', description: 'Yoğun bulut örtüsü', iconName: 'Cloud', isRain: false, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  45: { label: 'Sisli', description: 'Görüş mesafesi düşük sis tabakası', iconName: 'CloudFog', isRain: false, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  48: { label: 'Kırağılı Sis', description: 'Buzlanan dondurucu sis', iconName: 'CloudFog', isRain: false, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  51: { label: 'Hafif Çisenti', description: 'İnce taneli hafif çisenti yağış', iconName: 'CloudDrizzle', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  53: { label: 'Orta Çisenti', description: 'Aralıklı devam eden çisenti', iconName: 'CloudDrizzle', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  55: { label: 'Yoğun Çisenti', description: 'Sık taneli yoğun çisenti', iconName: 'CloudDrizzle', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  61: { label: 'Hafif Yağmur', description: 'Hafif şiddette yağmur', iconName: 'CloudRain', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  63: { label: 'Yağmurlu', description: 'Düzenli orta şiddette yağmur', iconName: 'CloudRain', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  65: { label: 'Kuvvetli Yağmur', description: 'Kuvvetli sağanak yağış', iconName: 'CloudRain', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  71: { label: 'Hafif Kar', description: 'Hafif kar serpintisi', iconName: 'Snowflake', isRain: false, isSnow: true, isThunder: false, isClear: false, isCloudy: true },
  73: { label: 'Kar Yağışlı', description: 'Düzenli kar yağışı', iconName: 'Snowflake', isRain: false, isSnow: true, isThunder: false, isClear: false, isCloudy: true },
  75: { label: 'Yoğun Kar', description: 'Şiddetli yoğun tipi ve kar', iconName: 'Snowflake', isRain: false, isSnow: true, isThunder: false, isClear: false, isCloudy: true },
  77: { label: 'Kar Taneleri', description: 'Uçuşan seyrek kar taneleri', iconName: 'Snowflake', isRain: false, isSnow: true, isThunder: false, isClear: false, isCloudy: true },
  80: { label: 'Kısa Süreli Sağanak', description: 'Geçici yerel sağanak geçişi', iconName: 'CloudRain', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  81: { label: 'Sağanak Yağış', description: 'Kuvvetli yerel sağanak', iconName: 'CloudRain', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  82: { label: 'Şiddetli Sağanak', description: 'Çok kuvvetli ani sağanak', iconName: 'CloudRain', isRain: true, isSnow: false, isThunder: false, isClear: false, isCloudy: true },
  85: { label: 'Kar Sağanağı', description: 'Hızlı geçen kar sağanağı', iconName: 'Snowflake', isRain: false, isSnow: true, isThunder: false, isClear: false, isCloudy: true },
  86: { label: 'Kuvvetli Kar Sağanağı', description: 'Şiddetli tipi ve kar fırtınası', iconName: 'Snowflake', isRain: false, isSnow: true, isThunder: false, isClear: false, isCloudy: true },
  95: { label: 'Gök Gürültülü Fırtına', description: 'Şimşek ve gök gürültülü sağanak', iconName: 'CloudLightning', isRain: true, isSnow: false, isThunder: true, isClear: false, isCloudy: true },
  96: { label: 'Dolu ve Fırtına', description: 'Hafif dolu eşliğinde fırtına', iconName: 'CloudLightning', isRain: true, isSnow: false, isThunder: true, isClear: false, isCloudy: true },
  99: { label: 'Kuvvetli Dolulu Fırtına', description: 'Şiddetli gök gürültüsü ve iri taneli dolu', iconName: 'CloudLightning', isRain: true, isSnow: false, isThunder: true, isClear: false, isCloudy: true },
};

export function getWeatherCondition(code: number): WeatherConditionInfo {
  return WMO_CODES[code] || {
    label: 'Değişken',
    description: 'Bölgesel hava koşulları',
    iconName: 'Cloud',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isClear: false,
    isCloudy: true,
  };
}
