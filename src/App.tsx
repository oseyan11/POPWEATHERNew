import React, { useState, useEffect, useCallback } from 'react';
import { Coordinates, WeatherData } from './types/weather';
import {
  fetchLiveWeather,
  getSavedCities,
  saveCity,
  removeSavedCity,
  getLastSelectedCity,
  setLastSelectedCity,
  reverseGeocode,
} from './services/weatherApi';
import { Language, getInitialLanguage, setStoredLanguage, translations } from './services/i18n';
import { TopBar } from './components/TopBar';
import { PopArtBanner } from './components/PopArtBanner';
import { CurrentHero } from './components/CurrentHero';
import { GrokWeatherInsight } from './components/GrokWeatherInsight';
import { HourlyForecast } from './components/HourlyForecast';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { DailyForecast } from './components/DailyForecast';
import { MetricGrid } from './components/MetricGrid';
import { RadarSimulationView } from './components/RadarSimulationView';
import { CitySearchModal } from './components/CitySearchModal';
import { TelemetrySettingsView } from './components/TelemetrySettingsView';
import { BottomTabBar, TabKey } from './components/BottomTabBar';
import { ShareWeatherModal } from './components/ShareWeatherModal';
import { RotateCw, AlertTriangle, Smartphone, Maximize2, Zap } from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<Coordinates>(getLastSelectedCity());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [savedCities, setSavedCities] = useState<Coordinates[]>(getSavedCities());
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [lang, setLangState] = useState<Language>(getInitialLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('pop_weather_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const [activeTab, setActiveTab] = useState<TabKey>('weather');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Sync theme with HTML root class and local storage
  useEffect(() => {
    try {
      localStorage.setItem('pop_weather_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const t = translations[lang];

  const handleSelectLanguage = (newLang: Language) => {
    setLangState(newLang);
    setStoredLanguage(newLang);
  };

  // Temperature unit converter
  const convertTemp = useCallback(
    (celsius: number): number => {
      if (isCelsius) return Math.round(celsius);
      return Math.round((celsius * 9) / 5 + 32);
    },
    [isCelsius]
  );

  // Load weather for target city
  const loadWeather = useCallback(async (city: Coordinates) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchLiveWeather(city);
      setWeatherData(data);
      if (data.city && city.name.toLowerCase().includes('mevcut')) {
        setSelectedCity((prev) => ({ ...prev, name: data.city, country: data.country || prev.country }));
        setLastSelectedCity({ ...city, name: data.city, country: data.country || city.country });
      } else {
        setLastSelectedCity(city);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : (lang === 'en' ? 'Weather data could not be loaded. Please try again.' : 'Hava durumu verisi alınamadı. Lütfen tekrar deneyin.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  // Initial load
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // Geolocation request
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert(lang === 'en' ? 'Your browser does not support geolocation.' : 'Tarayıcınız konum servisini desteklemiyor.');
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          const userCoord: Coordinates = {
            name: geo.name,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            country: geo.country || (lang === 'en' ? 'Turkey' : 'Türkiye'),
            admin1: geo.admin1,
          };
          setSelectedCity(userCoord);
          await loadWeather(userCoord);
        } catch {
          const fallbackCoord: Coordinates = {
            name: lang === 'en' ? 'Istanbul' : 'İstanbul',
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            country: lang === 'en' ? 'Turkey' : 'Türkiye',
          };
          setSelectedCity(fallbackCoord);
          await loadWeather(fallbackCoord);
        }
      },
      () => {
        setIsLoading(false);
        alert(
          lang === 'en'
            ? 'Location permission denied or timed out. You can pick any city from the search bar.'
            : 'Konum izni alınamadı veya zaman aşımına uğradı. Şehir arama listesinden dilediğiniz kenti seçebilirsiniz.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (city: Coordinates) => {
    setSelectedCity(city);
    if (activeTab === 'cities') {
      setActiveTab('weather');
    }
  };

  const handleSaveCity = (city: Coordinates) => {
    const updated = saveCity(city);
    setSavedCities(updated);
  };

  const handleRemoveCity = (lat: number, lon: number) => {
    const updated = removeSavedCity(lat, lon);
    setSavedCities(updated);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] dark:bg-[#0D0E12] text-black dark:text-white flex flex-col items-center justify-start antialiased selection:bg-[#FFE800]">
      {/* Desktop Helper Bar */}
      <div className="hidden md:flex w-full max-w-4xl items-center justify-between px-6 py-2.5 bg-[#FFE800] dark:bg-[#1A1B24] border-b-3 border-black text-xs font-comic text-black dark:text-white">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF1E56] border border-black animate-ping" />
          <span className="font-black text-sm tracking-wider">POP ART WEATHER</span>
          <span className="text-zinc-600 dark:text-zinc-400">·</span>
          <span>ROY LICHTENSTEIN & ANDY WARHOL COMIC METEOROLOGY</span>
        </div>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#252736] border-2 border-black text-black dark:text-white pop-btn shadow-[2px_2px_0_#000]"
        >
          {isPhoneFrame ? (
            <>
              <Maximize2 size={13} className="stroke-[3]" />
              <span>{t.switchWide}</span>
            </>
          ) : (
            <>
              <Smartphone size={13} className="stroke-[3]" />
              <span>{t.switchMobile}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Mobile App Container */}
      <main
        className={`w-full relative transition-all duration-300 flex flex-col bg-[#FFFDF0] dark:bg-[#13141B] min-h-screen ${
          isPhoneFrame
            ? 'md:max-w-[430px] md:my-6 md:rounded-[40px] md:border-4 md:border-black md:shadow-[10px_10px_0_#000] md:min-h-[880px] md:max-h-[920px] md:overflow-y-auto no-scrollbar'
            : 'max-w-2xl'
        }`}
      >
        {/* Hardware Notch in Phone frame mode */}
        {isPhoneFrame && (
          <div className="hidden md:flex justify-center pt-2 pb-1 bg-[#FFE800] dark:bg-[#1A1B24] border-b-2 border-black z-30">
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white mr-3" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <TopBar
          currentCity={selectedCity}
          onOpenSearch={() => setIsSearchOpen(true)}
          onRefresh={() => loadWeather(selectedCity)}
          onLocateUser={handleLocateUser}
          isLoading={isLoading}
          lang={lang}
          onSelectLanguage={handleSelectLanguage}
        />

        {/* Pop Art Banner with interactive comic sound stickers */}
        <PopArtBanner
          weatherCode={weatherData?.current.weatherCode ?? 0}
          windSpeed={weatherData?.current.windSpeed ?? 0}
          onOpenShare={() => setIsShareOpen(true)}
          lang={lang}
        />

        {/* Loading Comic Screen */}
        {isLoading && !weatherData && (
          <div className="flex-1 flex flex-col items-center justify-center py-28 space-y-4">
            <div className="p-6 rounded-3xl bg-[#FFE800] border-3 border-black shadow-[5px_5px_0_#000] rotate-[-2deg] text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FF1E56] border-2 border-black flex items-center justify-center text-white mb-2 shadow-[2px_2px_0_#000]">
                <Zap size={28} className="fill-yellow-300 text-yellow-300" />
              </div>
              <h2 className="text-3xl font-comic text-black font-black tracking-wider">
                {lang === 'en' ? 'LOADING... BAM!' : 'YÜKLENİYOR... BAM!'}
              </h2>
              <p className="text-xs font-sans font-bold text-zinc-800 mt-1">
                {lang === 'en' ? 'Fetching live atmospheric data from satellites.' : 'Uydulardan canlı atmosfer verisi çekiliyor.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-comic text-black">
              <RotateCw size={14} className="animate-spin stroke-[3] text-[#FF1E56]" />
              <span>{lang === 'en' ? 'PLEASE WAIT...' : 'BEKLEYİNİZ...'}</span>
            </div>
          </div>
        )}

        {/* Error Fallback Screen */}
        {errorMessage && !weatherData && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 font-comic">
            <div className="p-6 rounded-3xl bg-[#FF1E56] text-white border-3 border-black shadow-[6px_6px_0_#000]">
              <div className="w-12 h-12 mx-auto rounded-full bg-white text-black border-2 border-black flex items-center justify-center mb-2">
                <AlertTriangle size={24} className="text-[#FF1E56] stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black">
                {lang === 'en' ? 'OOPS! CONNECTION ERROR!' : 'EYVAH! BAĞLANTI HATASI!'}
              </h3>
              <p className="text-xs font-sans font-bold mt-1 max-w-xs">{errorMessage}</p>
            </div>
            <button
              onClick={() => loadWeather(selectedCity)}
              className="px-6 py-2.5 rounded-2xl bg-[#FFE800] text-black font-black text-sm border-2 border-black pop-btn shadow-[3px_3px_0_#000]"
            >
              {lang === 'en' ? 'RETRY NOW!' : 'YENİDEN DENE!'}
            </button>
          </div>
        )}

        {/* Tab 1: Primary Weather View */}
        {weatherData && activeTab === 'weather' && (
          <div className="pb-safe-navbar animate-in fade-in duration-200">
            {/* Primary Hero */}
            <CurrentHero
              data={weatherData}
              isCelsius={isCelsius}
              convertTemp={convertTemp}
              onOpenShare={() => setIsShareOpen(true)}
              lang={lang}
            />

            {/* Pop Art Comic Dialogue Insight */}
            <GrokWeatherInsight
              data={weatherData}
              isCelsius={isCelsius}
              convertTemp={convertTemp}
              lang={lang}
            />

            {/* Comic Strip Hourly Forecast Slider */}
            <HourlyForecast
              items={weatherData.hourly}
              convertTemp={convertTemp}
              lang={lang}
            />

            {/* D3-based Pop Art 24-Hour Temperature Trend Chart */}
            <TemperatureTrendChart
              hourly={weatherData.hourly}
              convertTemp={convertTemp}
              isCelsius={isCelsius}
              lang={lang}
            />

            {/* 10-day Pop Art Spectrum Forecast */}
            <DailyForecast
              items={weatherData.daily}
              currentTemp={weatherData.current.temperature}
              convertTemp={convertTemp}
              lang={lang}
            />

            {/* 6 Pop Art Metric Panels */}
            <MetricGrid
              data={weatherData}
              isCelsius={isCelsius}
              convertTemp={convertTemp}
              lang={lang}
            />

            {/* Homepage Bottom Creator Signature */}
            <div className="pt-3 pb-2 flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white dark:bg-[#1E1F2B] border-2 border-black rounded-xl shadow-[2px_2px_0_#000]">
                <span className="w-2 h-2 rounded-full bg-[#FF1E56] border border-black" />
                <span className="font-comic font-black text-xs tracking-widest text-black dark:text-white uppercase select-none">
                  CREATED BY OSEYAN
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pop Art Doppler Radar View */}
        {weatherData && activeTab === 'radar' && (
          <div className="pb-safe-navbar animate-in fade-in duration-200">
            <RadarSimulationView
              data={weatherData}
              convertTemp={convertTemp}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 3: Saved Cities & Search View */}
        {activeTab === 'cities' && (
          <div className="p-4 pb-safe-navbar space-y-4 animate-in fade-in duration-200 font-comic">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black dark:border-black">
              <div>
                <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-wider">
                  {lang === 'en' ? 'CITIES & LOCATIONS' : 'ŞEHİRLER & KONUMLAR'}
                </h2>
                <p className="text-xs font-sans font-bold text-zinc-700 dark:text-zinc-400">
                  {lang === 'en' ? 'Your Favorite Cities & Live Status' : 'Favori Kentleriniz ve Anlık Durum'}
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#00E676] text-black font-black text-xs border-2 border-black pop-btn shadow-[2px_2px_0_#000]"
              >
                {lang === 'en' ? '+ Add City' : '+ Şehir Ekle'}
              </button>
            </div>

            {/* Saved list */}
            <div className="space-y-2.5">
              {savedCities.map((city, idx) => {
                const isSelected =
                  Math.abs(city.lat - selectedCity.lat) < 0.05 &&
                  Math.abs(city.lon - selectedCity.lon) < 0.05;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectCity(city)}
                    className={`p-3.5 rounded-2xl cursor-pointer border-2 border-black shadow-[3px_3px_0_#000] pop-btn flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FFE800] text-black'
                        : 'bg-white dark:bg-[#1C1D27] text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-[#252736]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-black leading-none ${isSelected ? 'text-black' : 'text-black dark:text-white'}`}>
                          {city.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#FF1E56] text-white border border-black rounded-lg font-black uppercase">
                            {lang === 'en' ? 'ACTIVE' : 'AKTİF'}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-sans font-bold block mt-0.5 ${isSelected ? 'text-zinc-800' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCity(city.lat, city.lon);
                      }}
                      className="text-xs font-comic font-black text-zinc-500 dark:text-zinc-400 hover:text-[#FF1E56] dark:hover:text-[#FF1E56] p-2"
                      title={lang === 'en' ? 'Remove from list' : 'Listeden Kaldır'}
                    >
                      {lang === 'en' ? 'Remove' : 'Kaldır'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Telemetry & Settings View */}
        {weatherData && activeTab === 'telemetry' && (
          <div className="pb-safe-navbar animate-in fade-in duration-200">
            <TelemetrySettingsView
              data={weatherData}
              isCelsius={isCelsius}
              onToggleUnit={() => setIsCelsius(!isCelsius)}
              onRefresh={() => loadWeather(selectedCity)}
              lang={lang}
              onSelectLanguage={handleSelectLanguage}
              theme={theme}
              onToggleTheme={setTheme}
            />
          </div>
        )}

        {/* Fixed Mobile Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          lang={lang}
        />

        {/* City Search Modal */}
        <CitySearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectCity={handleSelectCity}
          savedCities={savedCities}
          onSaveCity={handleSaveCity}
          onRemoveCity={handleRemoveCity}
          currentCity={selectedCity}
          lang={lang}
        />

        {/* Shareable Weather Image Card Modal */}
        {weatherData && (
          <ShareWeatherModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            data={weatherData}
            isCelsius={isCelsius}
            convertTemp={convertTemp}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}
