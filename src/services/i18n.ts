export type Language = 'tr' | 'en' | 'de' | 'es' | 'fr';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷', badge: 'TR' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', badge: 'EN' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', badge: 'DE' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', badge: 'ES' },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', badge: 'FR' },
];

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  appDesktopMotto: string;
  switchWide: string;
  switchMobile: string;
  tabs: {
    weather: string;
    cities: string;
    radar: string;
    settings: string;
  };
  topBar: {
    searchPlaceholder: string;
    myLocation: string;
    shareTooltip: string;
    loading: string;
  };
  hero: {
    peak: string;
    dip: string;
    feelsLike: string;
    lastUpdated: string;
  };
  ai: {
    title: string;
    subtitle: string;
    analyzing: string;
    refreshTooltip: string;
    pressure: string;
    aqi: string;
    uv: string;
    humidity: string;
    good: string;
  };
  hourly: {
    title: string;
    subtitle: string;
    now: string;
  };
  daily: {
    title: string;
    badge: string;
    today: string;
    tomorrow: string;
    currentTemp: string;
  };
  chart: {
    title: string;
    subtitle: string;
    high: string;
    low: string;
  };
  metrics: {
    humidity: string;
    humidityDesc: string;
    wind: string;
    windDesc: string;
    uv: string;
    uvDesc: string;
    pressure: string;
    pressureDesc: string;
    cloudCover: string;
    cloudCoverDesc: string;
    windGusts: string;
    windGustsDesc: string;
    aqi: string;
    aqiDesc: string;
    rainProb: string;
    rainProbDesc: string;
    sunrise: string;
    sunset: string;
    clean: string;
  };
  radar: {
    title: string;
    subtitle: string;
    play: string;
    pause: string;
    speed: string;
    light: string;
    medium: string;
    heavy: string;
    storm: string;
    radarStation: string;
    activeEchoes: string;
    simulationBadge: string;
  };
  search: {
    title: string;
    subtitle: string;
    placeholder: string;
    popularCities: string;
    savedCities: string;
    noSavedCities: string;
    searchResults: string;
    searching: string;
    noResults: string;
    save: string;
    saved: string;
  };
  settings: {
    title: string;
    subtitle: string;
    telemetryTitle: string;
    latLon: string;
    pressure: string;
    windGust: string;
    cloudCover: string;
    displayPrefs: string;
    theme: string;
    themeDesc: string;
    lightTheme: string;
    darkTheme: string;
    language: string;
    languageDesc: string;
    unit: string;
    unitDesc: string;
    refreshData: string;
    refreshDataDesc: string;
    refreshBtn: string;
    turkish: string;
    english: string;
  };
  share: {
    title: string;
    subtitle: string;
    previewTitle: string;
    colorTheme: string;
    speechNote: string;
    presetsTitle: string;
    downloadBtn: string;
    shareBtn: string;
    copyBtn: string;
    copiedBtn: string;
    copyImageToClipboard: string;
    copiedSuccess: string;
    themes: {
      yellow: string;
      cyan: string;
      magenta: string;
      dark: string;
    };
    funSectionTitle: string;
    motto: string;
    footerCompleted: string;
    presets: string[];
    liveTag: string;
    feelsLike: string;
    high: string;
    low: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  tr: {
    appName: 'POP ART WEATHER',
    appSubtitle: 'ROY LICHTENSTEIN & ANDY WARHOL CANLI HAVA DURUMU',
    appDesktopMotto: 'ROY LICHTENSTEIN & ANDY WARHOL CANLI HAVA DURUMU',
    switchWide: 'Geniş Görünüme Geç',
    switchMobile: 'Mobil Çerçeve Modu',
    tabs: {
      weather: 'Hava',
      cities: 'Şehirler',
      radar: 'Radar',
      settings: 'Ayarlar',
    },
    topBar: {
      searchPlaceholder: 'Şehir Ara...',
      myLocation: 'Mevcut Konumum',
      shareTooltip: 'Hava Durumunu Paylaş',
      loading: 'Yükleniyor...',
    },
    hero: {
      peak: 'ZİRVE',
      dip: 'DİP',
      feelsLike: 'HİSSEDİLEN',
      lastUpdated: 'Son Güncelleme',
    },
    ai: {
      title: 'AI OVERVIEW',
      subtitle: 'Canlı Meteorolojik Zeka & Analiz',
      analyzing: 'GEMINI CANLI TELEMETRİYİ ANALİZ EDİYOR...',
      refreshTooltip: 'Yapay Zeka Analizini Yenile',
      pressure: 'BASINÇ',
      aqi: 'AQI',
      uv: 'UV',
      humidity: 'NEM',
      good: 'TEMİZ',
    },
    hourly: {
      title: 'GÜNÜN 24 SAATİ',
      subtitle: 'Saatlik Sıcaklık ve Yağış Olasılığı',
      now: 'Şimdi',
    },
    daily: {
      title: '10 GÜNLÜK ÇİZGİ ROMAN PROGRAMI',
      badge: 'POP ART SPEKTRUM',
      today: 'Bugün',
      tomorrow: 'Yarın',
      currentTemp: 'Mevcut Sıcaklık',
    },
    chart: {
      title: 'SICAKLIK GRAFİĞİ',
      subtitle: '24 Saatlik Termal Eğri',
      high: 'En Yüksek',
      low: 'En Düşük',
    },
    metrics: {
      humidity: 'NEM',
      humidityDesc: 'Bağıl havadaki su buharı',
      wind: 'RÜZGAR',
      windDesc: 'Yön ve hız şiddeti',
      uv: 'UV İNDEKSİ',
      uvDesc: 'Güneş ışını şiddeti',
      pressure: 'BASINÇ',
      pressureDesc: 'Deniz seviyesi barometre',
      cloudCover: 'BULUT ÖRTÜSÜ',
      cloudCoverDesc: 'Gökyüzü kaplama oranı',
      windGusts: 'RÜZGAR HAMLESİ',
      windGustsDesc: 'Ani esinti zirvesi',
      aqi: 'HAVA KALİTESİ',
      aqiDesc: 'Avrupa standart AQI',
      rainProb: 'YAĞIŞ OLASILIĞI',
      rainProbDesc: 'Önümüzdeki saat dilimi',
      sunrise: 'GÜN DOĞUMU',
      sunset: 'GÜN BATIMI',
      clean: 'TEMİZ',
    },
    radar: {
      title: 'ÇİZGİ ROMAN YAĞIŞ RADARI',
      subtitle: 'Canlı Yağış & Bulut Hareketi Simülasyonu',
      play: 'OYNAT',
      pause: 'DURDUR',
      speed: 'HIZ',
      light: 'Hafif',
      medium: 'Orta',
      heavy: 'Yoğun',
      storm: 'Fırtına',
      radarStation: 'Radar İstasyonu',
      activeEchoes: 'Aktif Eko',
      simulationBadge: 'POP RADAR SİMÜLASYONU',
    },
    search: {
      title: 'ŞEHİR ARA & KAYDET',
      subtitle: 'Pop Art Kataloğuna Yeni Şehir Ekle',
      placeholder: 'Şehir veya ilçe adı yazın (örn: Kadıköy, Berlin, Londra)...',
      popularCities: 'POPÜLER KENTLER',
      savedCities: 'KAYITLI ŞEHİRLERİM',
      noSavedCities: 'Henüz kaydedilmiş şehir yok. Arama yaparak ekleyin!',
      searchResults: 'ARAMA SONUÇLARI',
      searching: 'Aranıyor...',
      noResults: 'Sonuç bulunamadı.',
      save: 'Kaydet',
      saved: 'Kayıtlı',
    },
    settings: {
      title: 'POP ART TELEMETRİ & AYARLAR',
      subtitle: 'Stüdyo Kontrol Paneli · Canlı Sensör Verileri',
      telemetryTitle: 'CANLI ÇİZGİ ROMAN TELEMETRİSİ',
      latLon: 'ENLEM / BOYLAM',
      pressure: 'BASINÇ',
      windGust: 'RÜZGAR HAMLESİ',
      cloudCover: 'BULUT KAPLAMA',
      displayPrefs: 'GÖSTERGE TERCİHLERİ',
      theme: 'Görünüm Teması',
      themeDesc: 'Pop Art Açık veya Gece/Kara Tema modu',
      lightTheme: 'Açık Pop Art',
      darkTheme: 'Kara Tema (Noir)',
      language: 'Uygulama Dili',
      languageDesc: 'Türkçe veya İngilizce (Turkish or English)',
      unit: 'Sıcaklık Birimi',
      unitDesc: 'Santigrat veya Fahrenhayt',
      refreshData: 'Canlı Veri Tazele',
      refreshDataDesc: 'Open-Meteo uydularından canlı sorgu',
      refreshBtn: 'YENİLE!',
      turkish: 'Türkçe (TR)',
      english: 'English (EN)',
    },
    share: {
      title: 'POP WEATHER HİKAYE KARTI',
      subtitle: '16:9 Dikey Instagram Stories & Sosyal Medya Paylaşımı',
      previewTitle: 'Tam Kart Önizlemesi (1080×1920 · 16:9 Dikey)',
      colorTheme: 'RENK TEMASI SEÇİN:',
      speechNote: 'ÇİZGİ ROMAN NOTU / BALON MESAJI:',
      presetsTitle: 'Hazır Pop Art Replikler:',
      downloadBtn: 'İNDİR (PNG)',
      shareBtn: 'PAYLAŞ',
      copyBtn: 'KOPYALA',
      copiedBtn: 'KOPYALANDI!',
      copyImageToClipboard: 'Görseli Panoya Kopyala',
      copiedSuccess: 'Panoya Kopyalandı!',
      themes: {
        yellow: 'Klasik Sarı',
        cyan: 'Retro Mavi',
        magenta: 'Neon Pembe',
        dark: 'Warhol Siyah',
      },
      funSectionTitle: 'GÜNÜN POP KOMBİNİ & ENERJİ RADARI',
      motto: '“HAVA NASIL OLURSA OLSUN, POP ART ENERJİN TAVAN OLSUN!”',
      footerCompleted: 'anlık hava raporu tamamlandı · Çizgi roman tadında harika bir gün dileriz!',
      presets: [
        'Şemsiyeni kap ve fırla! ☔',
        'Kahvemi aldım, donuyoruz! ☕',
        'Gözlükleri takın, parıldıyor! 😎',
        'Plaj havası geldi, yanıyoruz! ☀️',
        'Bugün tam battaniye havası! 🛋️',
        'Hava mis, dışarı fırlayın! 🚀',
        'Rüzgara karşı saçları dağıtma! 💨',
        'Pop Art enerjisi tavan! ⚡',
      ],
      liveTag: 'CANLI!',
      feelsLike: 'HİSSEDİLEN',
      high: 'ZİRVE',
      low: 'DİP',
    },
  },
  en: {
    appName: 'POP ART WEATHER',
    appSubtitle: 'ROY LICHTENSTEIN & ANDY WARHOL LIVE WEATHER',
    appDesktopMotto: 'ROY LICHTENSTEIN & ANDY WARHOL LIVE WEATHER',
    switchWide: 'Switch to Wide View',
    switchMobile: 'Mobile Frame Mode',
    tabs: {
      weather: 'Weather',
      cities: 'Cities',
      radar: 'Radar',
      settings: 'Settings',
    },
    topBar: {
      searchPlaceholder: 'Search city...',
      myLocation: 'My Location',
      shareTooltip: 'Share Weather',
      loading: 'Loading...',
    },
    hero: {
      peak: 'HIGH',
      dip: 'LOW',
      feelsLike: 'FEELS LIKE',
      lastUpdated: 'Last Updated',
    },
    ai: {
      title: 'AI OVERVIEW',
      subtitle: 'Live Meteorological Intelligence & Analysis',
      analyzing: 'GEMINI IS ANALYZING LIVE TELEMETRY...',
      refreshTooltip: 'Refresh AI Analysis',
      pressure: 'PRESSURE',
      aqi: 'AQI',
      uv: 'UV',
      humidity: 'HUMIDITY',
      good: 'GOOD',
    },
    hourly: {
      title: '24-HOUR FORECAST',
      subtitle: 'Hourly Temperature & Precipitation Chance',
      now: 'Now',
    },
    daily: {
      title: '10-DAY COMIC SCHEDULE',
      badge: 'POP ART SPECTRUM',
      today: 'Today',
      tomorrow: 'Tomorrow',
      currentTemp: 'Current Temp',
    },
    chart: {
      title: 'TEMPERATURE TREND',
      subtitle: '24-Hour Thermal Curve',
      high: 'Max',
      low: 'Min',
    },
    metrics: {
      humidity: 'HUMIDITY',
      humidityDesc: 'Relative atmospheric moisture',
      wind: 'WIND',
      windDesc: 'Direction and velocity',
      uv: 'UV INDEX',
      uvDesc: 'Solar radiation intensity',
      pressure: 'PRESSURE',
      pressureDesc: 'Sea-level barometric reading',
      cloudCover: 'CLOUD COVER',
      cloudCoverDesc: 'Sky coverage percentage',
      windGusts: 'WIND GUSTS',
      windGustsDesc: 'Sudden gust peak',
      aqi: 'AIR QUALITY',
      aqiDesc: 'European standard AQI',
      rainProb: 'RAIN CHANCE',
      rainProbDesc: 'Next hourly window',
      sunrise: 'SUNRISE',
      sunset: 'SUNSET',
      clean: 'GOOD',
    },
    radar: {
      title: 'COMIC PRECIPITATION RADAR',
      subtitle: 'Live Precipitation & Cloud Movement Simulation',
      play: 'PLAY',
      pause: 'PAUSE',
      speed: 'SPEED',
      light: 'Light',
      medium: 'Medium',
      heavy: 'Heavy',
      storm: 'Storm',
      radarStation: 'Radar Station',
      activeEchoes: 'Active Echoes',
      simulationBadge: 'POP RADAR SIMULATION',
    },
    search: {
      title: 'SEARCH & SAVE CITY',
      subtitle: 'Add New City to Your Pop Art Catalog',
      placeholder: 'Type city or district name (e.g. London, New York, Tokyo)...',
      popularCities: 'POPULAR CITIES',
      savedCities: 'MY SAVED CITIES',
      noSavedCities: 'No saved cities yet. Use search to add one!',
      searchResults: 'SEARCH RESULTS',
      searching: 'Searching...',
      noResults: 'No results found.',
      save: 'Save',
      saved: 'Saved',
    },
    settings: {
      title: 'POP ART TELEMETRY & SETTINGS',
      subtitle: 'Studio Control Panel · Live Sensor Telemetry',
      telemetryTitle: 'LIVE COMIC TELEMETRY',
      latLon: 'LAT / LON',
      pressure: 'PRESSURE',
      windGust: 'WIND GUST',
      cloudCover: 'CLOUD COVER',
      displayPrefs: 'DISPLAY PREFERENCES',
      theme: 'Color Theme',
      themeDesc: 'Classic Pop Art or Pop Art Noir Dark Mode',
      lightTheme: 'Light Pop',
      darkTheme: 'Dark Theme (Noir)',
      language: 'App Language',
      languageDesc: 'Choose Turkish or English',
      unit: 'Temperature Unit',
      unitDesc: 'Celsius or Fahrenheit',
      refreshData: 'Refresh Live Data',
      refreshDataDesc: 'Query live Open-Meteo satellite feed',
      refreshBtn: 'REFRESH!',
      turkish: 'Türkçe (TR)',
      english: 'English (EN)',
    },
    share: {
      title: 'POP WEATHER STORY CARD',
      subtitle: '16:9 Vertical Instagram Stories & Social Share',
      previewTitle: 'Full Card Preview (1080×1920 · 16:9 Vertical)',
      colorTheme: 'CHOOSE COLOR THEME:',
      speechNote: 'COMIC NOTE / SPEECH BALLOON:',
      presetsTitle: 'Preset Pop Art Quotes:',
      downloadBtn: 'DOWNLOAD (PNG)',
      shareBtn: 'SHARE',
      copyBtn: 'COPY',
      copiedBtn: 'COPIED!',
      copyImageToClipboard: 'Copy Image to Clipboard',
      copiedSuccess: 'Copied to Clipboard!',
      themes: {
        yellow: 'Classic Yellow',
        cyan: 'Retro Cyan',
        magenta: 'Neon Pink',
        dark: 'Warhol Dark',
      },
      funSectionTitle: 'DAILY POP OUTFIT & ENERGY RADAR',
      motto: '“NO MATTER THE WEATHER, KEEP YOUR POP ART ENERGY AT 100%!”',
      footerCompleted: 'instant weather report completed · Have an iconic, comic-filled day!',
      presets: [
        'Grab your umbrella and go! ☔',
        'Got my hot coffee, freezing! ☕',
        'Put on your shades, shining! 😎',
        'Beach weather is here, scorching! ☀️',
        'Cozy blanket weather today! 🛋️',
        'Great weather, let’s go outside! 🚀',
        'Wind in your hair, pure Pop energy! 💨',
        'Pop Art energy through the roof! ⚡',
      ],
      liveTag: 'LIVE!',
      feelsLike: 'FEELS LIKE',
      high: 'HIGH',
      low: 'LOW',
    },
  },
  de: {
    appName: 'POP ART WEATHER',
    appSubtitle: 'ROY LICHTENSTEIN & ANDY WARHOL LIVE-WETTER',
    appDesktopMotto: 'ROY LICHTENSTEIN & ANDY WARHOL LIVE-WETTER',
    switchWide: 'Breite Ansicht',
    switchMobile: 'Mobiler Rahmen',
    tabs: {
      weather: 'Wetter',
      cities: 'Städte',
      radar: 'Radar',
      settings: 'Optionen',
    },
    topBar: {
      searchPlaceholder: 'Stadt suchen...',
      myLocation: 'Mein Standort',
      shareTooltip: 'Wetter teilen',
      loading: 'Laden...',
    },
    hero: {
      peak: 'MAX',
      dip: 'MIN',
      feelsLike: 'GEFÜHLT',
      lastUpdated: 'Aktualisiert',
    },
    ai: {
      title: 'AI OVERVIEW',
      subtitle: 'Live Meteorologische Intelligenz',
      analyzing: 'GEMINI ANALYSIERT LIVE-DATEN...',
      refreshTooltip: 'KI-Analyse aktualisieren',
      pressure: 'DRUCK',
      aqi: 'AQI',
      uv: 'UV',
      humidity: 'FEUCHTE',
      good: 'GUT',
    },
    hourly: {
      title: '24-STUNDEN VORHERSAGE',
      subtitle: 'Stündliche Temperatur & Niederschlag',
      now: 'Jetzt',
    },
    daily: {
      title: '10-TAGE COMIC VORSCHAU',
      badge: 'POP ART SPEKTRUM',
      today: 'Heute',
      tomorrow: 'Morgen',
      currentTemp: 'Aktuelle Temp',
    },
    chart: {
      title: 'TEMPERATURVERLAUF',
      subtitle: '24-Stunden Wärmekurve',
      high: 'Max',
      low: 'Min',
    },
    metrics: {
      humidity: 'FEUCHTIGKEIT',
      humidityDesc: 'Relative Luftfeuchtigkeit',
      wind: 'WIND',
      windDesc: 'Geschwindigkeit und Richtung',
      uv: 'UV-INDEX',
      uvDesc: 'Intensität der Sonneneinstrahlung',
      pressure: 'LUFTDRUCK',
      pressureDesc: 'Barometer auf Meereshöhe',
      cloudCover: 'BEWÖLKUNG',
      cloudCoverDesc: 'Himmelsbedeckung in Prozent',
      windGusts: 'WIND BÖEN',
      windGustsDesc: 'Maximale Windspitze',
      aqi: 'LUFTQUALITÄT',
      aqiDesc: 'Europäischer AQI-Standard',
      rainProb: 'REGENRISIKO',
      rainProbDesc: 'Nächste Stunde',
      sunrise: 'SONNENAUFGANG',
      sunset: 'SONNENUNTERGANG',
      clean: 'SAUBER',
    },
    radar: {
      title: 'COMIC NIEDERSCHLAGSRADAR',
      subtitle: 'Live Regen- & Wolkensimulation',
      play: 'START',
      pause: 'STOPP',
      speed: 'TEMPO',
      light: 'Leicht',
      medium: 'Mittel',
      heavy: 'Stark',
      storm: 'Gewitter',
      radarStation: 'Radarstation',
      activeEchoes: 'Aktive Echos',
      simulationBadge: 'POP RADAR SIMULATION',
    },
    search: {
      title: 'STADT SUCHEN & SPEICHERN',
      subtitle: 'Neue Stadt zum Katalog hinzufügen',
      placeholder: 'Stadt eingeben (z. B. Berlin, Wien, Zürich)...',
      popularCities: 'BELIEBTE METROPOLEN',
      savedCities: 'GESPEICHERTE ORTE',
      noSavedCities: 'Noch keine Orte gespeichert. Nutze die Suche!',
      searchResults: 'SUCHERGEBNISSE',
      searching: 'Suche läuft...',
      noResults: 'Keine Ergebnisse.',
      save: 'Merken',
      saved: 'Gemerkt',
    },
    settings: {
      title: 'POP ART TELEMETRIE & EINSTELLUNGEN',
      subtitle: 'Studio-Bedienfeld · Live-Sensordaten',
      telemetryTitle: 'LIVE COMIC TELEMETRIE',
      latLon: 'BREITE / LÄNGE',
      pressure: 'DRUCK',
      windGust: 'WIND BÖE',
      cloudCover: 'BEWÖLKUNG',
      displayPrefs: 'ANZEIGE-EINSTELLUNGEN',
      theme: 'Design-Modus',
      themeDesc: 'Klassisches Pop Art oder Pop Art Noir',
      lightTheme: 'Hell (Klassik)',
      darkTheme: 'Dunkel (Noir)',
      language: 'App-Sprache',
      languageDesc: 'Wähle deine bevorzugte Sprache',
      unit: 'Temperatureinheit',
      unitDesc: 'Celsius oder Fahrenheit',
      refreshData: 'Live-Daten aktualisieren',
      refreshDataDesc: 'Open-Meteo Satelliten abfragen',
      refreshBtn: 'AKTUALISIEREN!',
      turkish: 'Türkçe (TR)',
      english: 'English (EN)',
    },
    share: {
      title: 'POP WEATHER STORY-KARTE',
      subtitle: '16:9 Hochformat für Instagram & Social Media',
      previewTitle: 'Karten-Vorschau (1080×1920 · 16:9 Vertikal)',
      colorTheme: 'FARBTHEMA WÄHLEN:',
      speechNote: 'COMIC-NOTIZ / SPRECHBLASE:',
      presetsTitle: 'Pop Art Comic-Zitate:',
      downloadBtn: 'DOWNLOAD (PNG)',
      shareBtn: 'TEILEN',
      copyBtn: 'KOPIEREN',
      copiedBtn: 'KOPIERT!',
      copyImageToClipboard: 'In Zwischenablage kopieren',
      copiedSuccess: 'In die Zwischenablage kopiert!',
      themes: {
        yellow: 'Klassisch Gelb',
        cyan: 'Retro Cyan',
        magenta: 'Neon Pink',
        dark: 'Warhol Dunkel',
      },
      funSectionTitle: 'POP OUTFIT & ENERGIE RADAR',
      motto: '„EGAL WIE DAS WETTER WIRD, BEHALTE 100% POP ART ENERGIE!“',
      footerCompleted: 'Wetterbericht abgeschlossen · Hab einen legendären Comic-Tag!',
      presets: [
        'Schirm schnappen und los! ☔',
        'Kaffee ist fertig, eiskalt! ☕',
        'Sonnenbrille aufsetzen! 😎',
        'Strandwetter ist da, heiß! ☀️',
        'Kuscheldecken-Wetter heute! 🛋️',
        'Herrliches Wetter, raus! 🚀',
        'Volle Pop Art Energie! ⚡',
        'Windige Grüße heute! 💨',
      ],
      liveTag: 'LIVE!',
      feelsLike: 'GEFÜHLT',
      high: 'MAX',
      low: 'MIN',
    },
  },
  es: {
    appName: 'POP ART WEATHER',
    appSubtitle: 'ROY LICHTENSTEIN & ANDY WARHOL CLIMA EN VIVO',
    appDesktopMotto: 'ROY LICHTENSTEIN & ANDY WARHOL CLIMA EN VIVO',
    switchWide: 'Vista Amplia',
    switchMobile: 'Marco Móvil',
    tabs: {
      weather: 'Clima',
      cities: 'Ciudades',
      radar: 'Radar',
      settings: 'Ajustes',
    },
    topBar: {
      searchPlaceholder: 'Buscar ciudad...',
      myLocation: 'Mi Ubicación',
      shareTooltip: 'Compartir Clima',
      loading: 'Cargando...',
    },
    hero: {
      peak: 'MÁX',
      dip: 'MÍN',
      feelsLike: 'SENSACIÓN',
      lastUpdated: 'Actualizado',
    },
    ai: {
      title: 'AI OVERVIEW',
      subtitle: 'Inteligencia Meteorológica en Vivo',
      analyzing: 'GEMINI ESTÁ ANALIZANDO DATOS EN VIVO...',
      refreshTooltip: 'Actualizar análisis IA',
      pressure: 'PRESIÓN',
      aqi: 'AQI',
      uv: 'UV',
      humidity: 'HUMEDAD',
      good: 'BUENO',
    },
    hourly: {
      title: 'PRONÓSTICO 24 HORAS',
      subtitle: 'Temperatura y Probabilidad de Lluvia',
      now: 'Ahora',
    },
    daily: {
      title: 'CALENDARIO COMIC 10 DÍAS',
      badge: 'ESPECTRO POP ART',
      today: 'Hoy',
      tomorrow: 'Mañana',
      currentTemp: 'Temp Actual',
    },
    chart: {
      title: 'TENDENCIA TÉRMICA',
      subtitle: 'Curva Térmica de 24 Horas',
      high: 'Máx',
      low: 'Mín',
    },
    metrics: {
      humidity: 'HUMEDAD',
      humidityDesc: 'Humedad relativa en el aire',
      wind: 'VIENTO',
      windDesc: 'Velocidad y dirección',
      uv: 'ÍNDICE UV',
      uvDesc: 'Intensidad de radiación solar',
      pressure: 'PRESIÓN',
      pressureDesc: 'Barómetro a nivel del mar',
      cloudCover: 'NUBOSIDAD',
      cloudCoverDesc: 'Porcentaje de cobertura de cielo',
      windGusts: 'RÁFAGAS',
      windGustsDesc: 'Pico repentino de viento',
      aqi: 'CALIDAD DEL AIRE',
      aqiDesc: 'Estándar europeo AQI',
      rainProb: 'PROB. LLUVIA',
      rainProbDesc: 'Próxima hora',
      sunrise: 'AMANECER',
      sunset: 'ATARDECER',
      clean: 'LIMPIO',
    },
    radar: {
      title: 'RADAR COMIC DE PRECIPITACIONES',
      subtitle: 'Simulación de Lluvia y Nubes',
      play: 'PLAY',
      pause: 'PAUSA',
      speed: 'VELOCIDAD',
      light: 'Ligera',
      medium: 'Media',
      heavy: 'Fuerte',
      storm: 'Tormenta',
      radarStation: 'Estación de Radar',
      activeEchoes: 'Ecos Activos',
      simulationBadge: 'SIMULACIÓN POP RADAR',
    },
    search: {
      title: 'BUSCAR Y GUARDAR CIUDAD',
      subtitle: 'Añadir nueva ciudad al catálogo Pop',
      placeholder: 'Escribe nombre de ciudad (ej. Madrid, Barcelona)...',
      popularCities: 'CIUDADES POPULARES',
      savedCities: 'MIS CIUDADES',
      noSavedCities: 'No hay ciudades guardadas. ¡Usa el buscador!',
      searchResults: 'RESULTADOS DE BÚSQUEDA',
      searching: 'Buscando...',
      noResults: 'Sin resultados.',
      save: 'Guardar',
      saved: 'Guardado',
    },
    settings: {
      title: 'TELEMETRÍA Y AJUSTES POP ART',
      subtitle: 'Panel de Estudio · Sensores en Vivo',
      telemetryTitle: 'TELEMETRÍA COMIC EN VIVO',
      latLon: 'LAT / LON',
      pressure: 'PRESIÓN',
      windGust: 'RÁFAGA',
      cloudCover: 'NUBOSIDAD',
      displayPrefs: 'PREFERENCIAS DE PANTALLA',
      theme: 'Tema Visual',
      themeDesc: 'Pop Art Claro o Modo Oscuro Noir',
      lightTheme: 'Claro (Clásico)',
      darkTheme: 'Oscuro (Noir)',
      language: 'Idioma de la App',
      languageDesc: 'Selecciona tu idioma preferido',
      unit: 'Unidad de Temperatura',
      unitDesc: 'Celsius o Fahrenheit',
      refreshData: 'Actualizar Datos en Vivo',
      refreshDataDesc: 'Consulta satelital Open-Meteo',
      refreshBtn: '¡ACTUALIZAR!',
      turkish: 'Türkçe (TR)',
      english: 'English (EN)',
    },
    share: {
      title: 'TARJETA DE HISTORIA POP WEATHER',
      subtitle: '16:9 Vertical para Instagram y Redes',
      previewTitle: 'Vista previa completa (1080×1920 · 16:9)',
      colorTheme: 'ELEGIR TEMA DE COLOR:',
      speechNote: 'NOTA COMIC / GLOBO DE DIÁLOGO:',
      presetsTitle: 'Frases Pop Art Predeterminadas:',
      downloadBtn: 'DESCARGAR (PNG)',
      shareBtn: 'COMPARTIR',
      copyBtn: 'COPIAR',
      copiedBtn: '¡COPIADO!',
      copyImageToClipboard: 'Copiar imagen al portapapeles',
      copiedSuccess: '¡Copiado al portapapeles!',
      themes: {
        yellow: 'Amarillo Clásico',
        cyan: 'Cian Retro',
        magenta: 'Rosa Neón',
        dark: 'Oscuro Warhol',
      },
      funSectionTitle: 'OUTFIT POP & RADAR DE ENERGÍA',
      motto: '“¡NO IMPORTA EL CLIMA, MANTÉN TU ENERGÍA POP AL 100%!”',
      footerCompleted: 'informe meteorológico completado · ¡Que tengas un día épico!',
      presets: [
        '¡Coge tu paraguas y sal! ☔',
        '¡Café caliente en mano, qué frío! ☕',
        '¡Ponte las gafas de sol, brilla! 😎',
        '¡Llegó el calor de playa, fuego! ☀️',
        '¡Hoy toca manta y sofá! 🛋️',
        '¡Día espectacular, a disfrutar! 🚀',
        '¡El viento sopla con estilo! 💨',
        '¡Energía Pop Art al máximo! ⚡',
      ],
      liveTag: '¡EN VIVO!',
      feelsLike: 'SENSACIÓN',
      high: 'MÁX',
      low: 'MÍN',
    },
  },
  fr: {
    appName: 'POP ART WEATHER',
    appSubtitle: 'ROY LICHTENSTEIN & ANDY WARHOL MÉTÉO EN DIRECT',
    appDesktopMotto: 'ROY LICHTENSTEIN & ANDY WARHOL MÉTÉO EN DIRECT',
    switchWide: 'Vue Large',
    switchMobile: 'Cadre Mobile',
    tabs: {
      weather: 'Météo',
      cities: 'Villes',
      radar: 'Radar',
      settings: 'Réglages',
    },
    topBar: {
      searchPlaceholder: 'Rechercher une ville...',
      myLocation: 'Ma Position',
      shareTooltip: 'Partager la météo',
      loading: 'Chargement...',
    },
    hero: {
      peak: 'MAX',
      dip: 'MIN',
      feelsLike: 'RESSENTI',
      lastUpdated: 'Mis à jour',
    },
    ai: {
      title: 'AI OVERVIEW',
      subtitle: 'Intelligence Météorologique en Direct',
      analyzing: 'GEMINI ANALYSE LA TÉLÉMÉTRIE EN DIRECT...',
      refreshTooltip: 'Actualiser analyse IA',
      pressure: 'PRESSION',
      aqi: 'AQI',
      uv: 'UV',
      humidity: 'HUMIDITÉ',
      good: 'BON',
    },
    hourly: {
      title: 'PRÉVISIONS SUR 24 HEURES',
      subtitle: 'Température horaire & Risque de pluie',
      now: 'Actuel',
    },
    daily: {
      title: 'PROGRAMME COMIC SUR 10 JOURS',
      badge: 'SPECTRE POP ART',
      today: "Aujourd'hui",
      tomorrow: 'Demain',
      currentTemp: 'Temp Actuelle',
    },
    chart: {
      title: 'COURBE DE TEMPÉRATURE',
      subtitle: 'Évolution thermique sur 24h',
      high: 'Max',
      low: 'Min',
    },
    metrics: {
      humidity: 'HUMIDITÉ',
      humidityDesc: 'Humidité relative de l\'air',
      wind: 'VENT',
      windDesc: 'Direction et vitesse',
      uv: 'INDICE UV',
      uvDesc: 'Intensité du rayonnement solaire',
      pressure: 'PRESSION',
      pressureDesc: 'Baromètre au niveau de la mer',
      cloudCover: 'COUVERTURE',
      cloudCoverDesc: 'Pourcentage de ciel nuageux',
      windGusts: 'RAFALES',
      windGustsDesc: 'Pointe de rafale instantanée',
      aqi: 'QUALITÉ DE L\'AIR',
      aqiDesc: 'Norme européenne AQI',
      rainProb: 'RISQUE PLUIE',
      rainProbDesc: 'Heure suivante',
      sunrise: 'LEVER DU SOLEIL',
      sunset: 'COUCHER DU SOLEIL',
      clean: 'PROPRE',
    },
    radar: {
      title: 'RADAR DE PRÉCIPITATIONS COMIC',
      subtitle: 'Simulation de Pluie et Nuages',
      play: 'LECTURE',
      pause: 'PAUSE',
      speed: 'VITESSE',
      light: 'Légère',
      medium: 'Modérée',
      heavy: 'Forte',
      storm: 'Orage',
      radarStation: 'Station Radar',
      activeEchoes: 'Échos Actifs',
      simulationBadge: 'SIMULATION POP RADAR',
    },
    search: {
      title: 'RECHERCHER ET ENREGISTRER',
      subtitle: 'Ajouter une ville au catalogue Pop',
      placeholder: 'Nom de la ville (ex. Paris, Lyon, Genève)...',
      popularCities: 'MÉTROPOLES POPULAIRES',
      savedCities: 'MES VILLES',
      noSavedCities: 'Aucune ville enregistrée. Utilisez la recherche !',
      searchResults: 'RÉSULTATS DE RECHERCHE',
      searching: 'Recherche...',
      noResults: 'Aucun résultat.',
      save: 'Ajouter',
      saved: 'Ajouté',
    },
    settings: {
      title: 'TÉLÉMÉTRIE ET RÉGLAGES POP ART',
      subtitle: 'Tableau de bord Studio · Capteurs en direct',
      telemetryTitle: 'TÉLÉMÉTRIE COMIC EN DIRECT',
      latLon: 'LAT / LON',
      pressure: 'PRESSION',
      windGust: 'RAFALE',
      cloudCover: 'COUVERTURE',
      displayPrefs: 'PRÉFÉRENCES D\'AFFICHAGE',
      theme: 'Thème Visuel',
      themeDesc: 'Pop Art Clair ou Mode Sombre Noir',
      lightTheme: 'Clair (Classique)',
      darkTheme: 'Sombre (Noir)',
      language: 'Langue de l\'application',
      languageDesc: 'Sélectionnez la langue souhaitée',
      unit: 'Unité de Température',
      unitDesc: 'Celsius ou Fahrenheit',
      refreshData: 'Actualiser les données',
      refreshDataDesc: 'Requête satellite Open-Meteo',
      refreshBtn: 'ACTUALISER !',
      turkish: 'Türkçe (TR)',
      english: 'English (EN)',
    },
    share: {
      title: 'CARTE STORY POP WEATHER',
      subtitle: '16:9 Vertical pour Instagram et Réseaux',
      previewTitle: 'Aperçu complet (1080×1920 · 16:9)',
      colorTheme: 'CHOISIR LE THÈME DE COULEUR :',
      speechNote: 'BULLE COMIC / NOTE POP ART :',
      presetsTitle: 'Répliques Comic prédéfinies :',
      downloadBtn: 'TÉLÉCHARGER (PNG)',
      shareBtn: 'PARTAGER',
      copyBtn: 'COPIER',
      copiedBtn: 'COPIÉ !',
      copyImageToClipboard: 'Copier dans le presse-papiers',
      copiedSuccess: 'Copié dans le presse-papiers !',
      themes: {
        yellow: 'Jaune Classique',
        cyan: 'Cyan Rétro',
        magenta: 'Rose Néon',
        dark: 'Sombre Warhol',
      },
      funSectionTitle: 'OUTFIT POP & RADAR D\'ÉNERGIE',
      motto: '« PEU IMPORTE LA MÉTÉO, GARDEZ VOTRE ÉNERGIE POP À 100% ! »',
      footerCompleted: 'bulletin météo instantané terminé · Passez une superbe journée comic !',
      presets: [
        'Prenez votre parapluie et foncez ! ☔',
        'Café chaud en main, ça caille ! ☕',
        'Sortez les lunettes de soleil ! 😎',
        'Météo plage au rendez-vous ! ☀️',
        'Aujourd\'hui c\'est plaid et détente ! 🛋️',
        'Temps magnifique, tous dehors ! 🚀',
        'Le vent souffle avec panache ! 💨',
        'Énergie Pop Art au sommet ! ⚡',
      ],
      liveTag: 'EN DIRECT !',
      feelsLike: 'RESSENTI',
      high: 'MAX',
      low: 'MIN',
    },
  },
};

export const WMO_TRANSLATIONS: Record<
  number,
  { labelTr: string; descTr: string; labelEn: string; descEn: string }
> = {
  0: { labelTr: 'Açık', descTr: 'Gökyüzü tamamen berrak', labelEn: 'Clear Sky', descEn: 'Completely clear sky' },
  1: { labelTr: 'Çoğunlukla Açık', descTr: 'Hafif seyrek bulutlar', labelEn: 'Mostly Clear', descEn: 'Mainly clear with scattered clouds' },
  2: { labelTr: 'Parçalı Bulutlu', descTr: 'Güneşli ve parçalı bulut geçişleri', labelEn: 'Partly Cloudy', descEn: 'Scattered clouds and sunny intervals' },
  3: { labelTr: 'Kapalı', descTr: 'Yoğun bulut örtüsü', labelEn: 'Overcast', descEn: 'Dense cloud blanket' },
  45: { labelTr: 'Sisli', descTr: 'Görüş mesafesi düşük sis tabakası', labelEn: 'Foggy', descEn: 'Dense fog and reduced visibility' },
  48: { labelTr: 'Kırağılı Sis', descTr: 'Buzlanan dondurucu sis', labelEn: 'Depositing Rime Fog', descEn: 'Freezing rime fog' },
  51: { labelTr: 'Hafif Çisenti', descTr: 'İnce taneli hafif çisenti yağış', labelEn: 'Light Drizzle', descEn: 'Fine light drizzle' },
  53: { labelTr: 'Orta Çisenti', descTr: 'Aralıklı devam eden çisenti', labelEn: 'Moderate Drizzle', descEn: 'Steady intermittent drizzle' },
  55: { labelTr: 'Yoğun Çisenti', descTr: 'Sık taneli yoğun çisenti', labelEn: 'Dense Drizzle', descEn: 'Heavy thick drizzle' },
  61: { labelTr: 'Hafif Yağmur', descTr: 'Hafif şiddette yağmur', labelEn: 'Slight Rain', descEn: 'Gentle light rain' },
  63: { labelTr: 'Yağmurlu', descTr: 'Düzenli orta şiddette yağmur', labelEn: 'Moderate Rain', descEn: 'Continuous moderate rain' },
  65: { labelTr: 'Kuvvetli Yağmur', descTr: 'Kuvvetli sağanak yağış', labelEn: 'Heavy Rain', descEn: 'Intense heavy rain shower' },
  71: { labelTr: 'Hafif Kar', descTr: 'Hafif kar serpintisi', labelEn: 'Slight Snow', descEn: 'Light snow flurries' },
  73: { labelTr: 'Kar Yağışlı', descTr: 'Düzenli kar yağışı', labelEn: 'Moderate Snow', descEn: 'Steady snowfall' },
  75: { labelTr: 'Yoğun Kar', descTr: 'Şiddetli yoğun tipi ve kar', labelEn: 'Heavy Snow', descEn: 'Heavy blizzard and snowfall' },
  77: { labelTr: 'Kar Taneleri', descTr: 'Uçuşan seyrek kar taneleri', labelEn: 'Snow Grains', descEn: 'Scattered snow grains' },
  80: { labelTr: 'Kısa Süreli Sağanak', descTr: 'Geçici yerel sağanak geçişi', labelEn: 'Passing Showers', descEn: 'Transient localized showers' },
  81: { labelTr: 'Sağanak Yağış', descTr: 'Kuvvetli yerel sağanak', labelEn: 'Rain Showers', descEn: 'Strong rain showers' },
  82: { labelTr: 'Şiddetli Sağanak', descTr: 'Çok kuvvetli ani sağanak', labelEn: 'Violent Showers', descEn: 'Violent torrential rain showers' },
  85: { labelTr: 'Kar Sağanağı', descTr: 'Hızlı geçen kar sağanağı', labelEn: 'Snow Showers', descEn: 'Passing snow showers' },
  86: { labelTr: 'Kuvvetli Kar Sağanağı', descTr: 'Şiddetli tipi ve kar fırtınası', labelEn: 'Heavy Snow Showers', descEn: 'Intense heavy snow showers' },
  95: { labelTr: 'Gök Gürültülü Fırtına', descTr: 'Şimşek ve gök gürültülü sağanak', labelEn: 'Thunderstorm', descEn: 'Thunder and lightning storm' },
  96: { labelTr: 'Dolu ve Fırtına', descTr: 'Hafif dolu eşliğinde fırtına', labelEn: 'Thunderstorm with Hail', descEn: 'Thunderstorm with slight hail' },
  99: { labelTr: 'Kuvvetli Dolulu Fırtına', descTr: 'Şiddetli gök gürültüsü ve iri taneli dolu', labelEn: 'Severe Hailstorm', descEn: 'Severe storm with heavy hail' },
};

export function getLocalizedCondition(code: number, lang: Language): { label: string; description: string } {
  const item = WMO_TRANSLATIONS[code];
  if (!item) {
    return {
      label: lang === 'tr' ? 'Değişken' : 'Variable',
      description: lang === 'tr' ? 'Bölgesel hava koşulları' : 'Regional weather conditions',
    };
  }
  return {
    label: lang === 'tr' ? item.labelTr : item.labelEn,
    description: lang === 'tr' ? item.descTr : item.descEn,
  };
}

export function formatLocalizedDayName(dateStr: string, idx: number, lang: Language): string {
  if (idx === 0) {
    switch (lang) {
      case 'tr': return 'Bugün';
      case 'de': return 'Heute';
      case 'es': return 'Hoy';
      case 'fr': return "Aujourd'hui";
      default: return 'Today';
    }
  }
  if (idx === 1) {
    switch (lang) {
      case 'tr': return 'Yarın';
      case 'de': return 'Morgen';
      case 'es': return 'Mañana';
      case 'fr': return 'Demain';
      default: return 'Tomorrow';
    }
  }
  const d = new Date(dateStr);
  const dayMap: Record<Language, string[]> = {
    tr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  };
  const days = dayMap[lang] || dayMap.en;
  return days[d.getDay()];
}

const STORAGE_LANG_KEY = 'pop_weather_lang';

export function getStoredLanguage(): Language {
  try {
    const val = localStorage.getItem(STORAGE_LANG_KEY) as Language;
    if (val && SUPPORTED_LANGUAGES.some((l) => l.code === val)) {
      return val;
    }
  } catch {
    // fallback
  }
  return 'tr';
}

export const getInitialLanguage = getStoredLanguage;

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  } catch {
    // ignore
  }
}
