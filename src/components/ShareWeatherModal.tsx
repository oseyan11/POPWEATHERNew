import React, { useRef, useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types/weather';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Maximize2,
} from 'lucide-react';
import { Language, translations, getLocalizedCondition } from '../services/i18n';

interface ShareWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeatherData;
  isCelsius: boolean;
  convertTemp: (c: number) => number;
  lang: Language;
}

type ThemeColor = 'yellow' | 'cyan' | 'magenta' | 'dark';

const COMIC_NOTE_PRESETS_TR = [
  'Şemsiyeni kap ve fırla! ☔',
  'Kahvemi aldım, donuyoruz! ☕',
  'Gözlükleri takın, parıldıyor! 😎',
  'Plaj havası geldi, yanıyoruz! ☀️',
  'Bugün tam battaniye havası! 🛋️',
  'Hava mis, dışarı fırlayın! 🚀',
  'Rüzgara karşı saçları dağıtma! 💨',
  'Pop Art enerjisi tavan! ⚡',
];

const COMIC_NOTE_PRESETS_EN = [
  'Grab your umbrella and run! ☔',
  'Got my coffee, freezing cold! ☕',
  'Put on shades, glowing bright! 😎',
  'Beach vibes incoming, sizzling! ☀️',
  'Cozy blanket day right here! 🛋️',
  'Gorgeous weather, burst outside! 🚀',
  'Hold your hats against the wind! 💨',
  'Pop Art energy to the max! ⚡',
];

export const ShareWeatherModal: React.FC<ShareWeatherModalProps> = ({
  isOpen,
  onClose,
  data,
  isCelsius,
  convertTemp,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<ThemeColor>('yellow');
  const t = translations[lang];

  const presets = lang === 'en' ? COMIC_NOTE_PRESETS_EN : COMIC_NOTE_PRESETS_TR;
  const [customNote, setCustomNote] = useState<string>(presets[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanNativeShare(true);
    }
  }, []);

  // Set contextual default note based on real live weather and language
  useEffect(() => {
    if (isOpen) {
      if (data.current.temperature >= 27) {
        setCustomNote(lang === 'en' ? 'Put on shades, glowing bright! 😎' : 'Gözlükleri takın, parıldıyor! 😎');
      } else if (data.current.temperature <= 10) {
        setCustomNote(lang === 'en' ? 'Got my coffee, freezing cold! ☕' : 'Kahvemi aldım, donuyoruz! ☕');
      } else if (
        data.current.precipitation > 0 ||
        (data.hourly[0]?.precipitationProbability ?? 0) >= 40
      ) {
        setCustomNote(lang === 'en' ? 'Grab your umbrella and run! ☔' : 'Şemsiyeni kap ve fırla! ☔');
      } else {
        setCustomNote(lang === 'en' ? 'Gorgeous weather, burst outside! 🚀' : 'Hava mis, dışarı fırlayın! 🚀');
      }
    }
  }, [isOpen, data, lang]);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Strictly Vertical 16:9 format (1080 x 1920)
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    // Pop Art color schemes
    const palettes: Record<
      ThemeColor,
      { bg: string; dotColor: string; cardBg: string; accent: string; secondary: string; text: string }
    > = {
      yellow: {
        bg: '#FFE800',
        dotColor: '#00E5FF',
        cardBg: '#FFFDF0',
        accent: '#FF1E56',
        secondary: '#00E676',
        text: '#000000',
      },
      cyan: {
        bg: '#00E5FF',
        dotColor: '#FFE800',
        cardBg: '#FFFDF0',
        accent: '#FF1E56',
        secondary: '#FFE800',
        text: '#000000',
      },
      magenta: {
        bg: '#FF1E56',
        dotColor: '#FFE800',
        cardBg: '#FFFDF0',
        accent: '#FFE800',
        secondary: '#00E5FF',
        text: '#000000',
      },
      dark: {
        bg: '#18181B',
        dotColor: '#FFE800',
        cardBg: '#FFFDF0',
        accent: '#00E5FF',
        secondary: '#FF1E56',
        text: '#000000',
      },
    };

    const curPalette = palettes[theme];

    // 1. BACKGROUND & BORDER
    ctx.fillStyle = curPalette.bg;
    ctx.fillRect(0, 0, width, height);

    // Roy Lichtenstein Halftone Ben-Day Dots
    ctx.fillStyle = curPalette.dotColor;
    const dotSpacing = 38;
    const dotRadius = 4.5;
    for (let x = 15; x < width; x += dotSpacing) {
      for (let y = 15; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer Thick Comic Book Frame
    ctx.lineWidth = 24;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Inner thin border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // Helpers
    const drawPopBox = (
      bx: number,
      by: number,
      bw: number,
      bh: number,
      bg: string,
      shadowOffset = 12,
      radius = 28
    ) => {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(bx + shadowOffset, by + shadowOffset, bw, bh, radius);
      ctx.fill();

      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, radius);
      ctx.fill();

      ctx.lineWidth = 7;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    };

    const drawStarburst = (
      cx: number,
      cy: number,
      points: number,
      outerRadius: number,
      innerRadius: number,
      color: string
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / points;

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy - outerRadius + 8);
      for (let i = 0; i < points; i++) {
        x = cx + 8 + Math.cos(rot) * outerRadius;
        y = cy + 8 + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + 8 + Math.cos(rot) * innerRadius;
        y = cy + 8 + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx + 8, cy - outerRadius + 8);
      ctx.closePath();
      ctx.fill();

      rot = (Math.PI / 2) * 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < points; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    };

    // 3. TOP BANNER HEADER
    const topY = 55;
    drawPopBox(60, topY, width - 120, 105, '#FFFDF0', 10, 24);

    ctx.fillStyle = '#000000';
    ctx.font = '900 48px "Bangers", "Impact", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('POP WEATHER', 100, topY + 54);

    // Live Tag
    drawPopBox(width - 240, topY + 20, 140, 64, curPalette.accent, 6, 16);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.share.liveTag, width - 170, topY + 54);

    // 4. CITY HERO CARD
    const heroY = 195;
    const heroHeight = 490;
    drawPopBox(60, heroY, width - 120, heroHeight, '#FFFDF0', 14, 36);

    const displayCity = (data.city || (lang === 'en' ? 'ISTANBUL' : 'İSTANBUL')).toUpperCase();
    ctx.fillStyle = '#000000';
    ctx.font = '900 66px "Bangers", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(displayCity, 105, heroY + 80);

    ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText(`${data.country || 'Türkiye'} · ${data.lastUpdated}`, 105, heroY + 130);

    // Weather Condition Badge
    const conditionInfo = getLocalizedCondition(data.current.weatherCode, lang);
    drawPopBox(105, heroY + 165, 340, 58, curPalette.secondary, 6, 16);
    ctx.fillStyle = '#000000';
    ctx.font = '900 30px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(conditionInfo.label.toUpperCase(), 105 + 170, heroY + 196);

    // High / Low temperatures
    const curTemp = convertTemp(data.current.temperature);
    const unitSymbol = isCelsius ? '°C' : '°F';
    const maxT = data.daily[0] ? convertTemp(data.daily[0].temperatureMax) : curTemp + 3;
    const minT = data.daily[0] ? convertTemp(data.daily[0].temperatureMin) : curTemp - 4;

    drawPopBox(105, heroY + 245, 175, 52, '#FFE800', 4, 14);
    ctx.fillStyle = '#000000';
    ctx.font = '900 24px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${t.hero.peak}: ${maxT}°`, 105 + 87, heroY + 273);

    drawPopBox(295, heroY + 245, 175, 52, '#00E5FF', 4, 14);
    ctx.fillStyle = '#000000';
    ctx.font = '900 24px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${t.hero.dip}: ${minT}°`, 295 + 87, heroY + 273);

    // GIANT POP ART TEMPERATURE NUMBERS
    const tempStr = `${curTemp}${unitSymbol}`;
    const tempX = width - 110;
    const tempY = heroY + 195;
    ctx.textAlign = 'right';

    ctx.fillStyle = '#000000';
    ctx.font = '900 150px "Bangers", sans-serif';
    ctx.fillText(tempStr, tempX + 8, tempY + 8);

    ctx.fillStyle = curPalette.accent;
    ctx.fillText(tempStr, tempX, tempY);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(tempStr, tempX, tempY);

    // DEDICATED FEELS-LIKE POP ART PILL
    const appTemp = convertTemp(data.current.apparentTemperature);
    const feelsLikeBoxW = 260;
    const feelsLikeBoxX = width - 110 - feelsLikeBoxW;
    const feelsLikeBoxY = heroY + 240;

    drawPopBox(feelsLikeBoxX, feelsLikeBoxY, feelsLikeBoxW, 58, '#00E676', 6, 16);
    ctx.fillStyle = '#000000';
    ctx.font = '900 25px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${t.hero.feelsLike}: ${appTemp}${unitSymbol}`, feelsLikeBoxX + feelsLikeBoxW / 2, feelsLikeBoxY + 31);

    // Starburst explosion sticker in top right of hero
    drawStarburst(width - 150, heroY + 55, 12, 58, 30, curPalette.accent);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 24px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POW!', width - 150, heroY + 60);

    // 5. POP ART COMIC SPEECH BALLOON / NOTE SECTION
    const noteY = 715;
    const noteHeight = 175;
    const noteBoxWidth = width - 120;
    const bubbleBg = '#FFE800';

    const tailX = 220;
    const tailY = noteY;

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(60 + 12, noteY + 12, noteBoxWidth, noteHeight, 28);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(tailX + 12, tailY + 12);
    ctx.lineTo(tailX - 25 + 12, tailY - 32 + 12);
    ctx.lineTo(tailX + 40 + 12, tailY + 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = bubbleBg;
    ctx.beginPath();
    ctx.roundRect(60, noteY, noteBoxWidth, noteHeight, 28);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tailX - 25, tailY - 32);
    ctx.lineTo(tailX + 40, tailY);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 8;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(60, noteY, noteBoxWidth, noteHeight, 28);
    ctx.stroke();

    ctx.fillStyle = bubbleBg;
    ctx.beginPath();
    ctx.rect(tailX - 5, tailY - 4, 48, 12);
    ctx.fill();

    drawStarburst(115, noteY + 45, 10, 36, 18, '#FF1E56');
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 18px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POP:', 115, noteY + 48);

    const noteText = (customNote || (lang === 'en' ? 'Pop Art Weather Report!' : 'Günün Pop Art Raporu!')).trim();
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';

    if (noteText.length > 38) {
      ctx.font = '900 36px "Bangers", "Impact", sans-serif';
    } else if (noteText.length > 25) {
      ctx.font = '900 42px "Bangers", "Impact", sans-serif';
    } else {
      ctx.font = '900 48px "Bangers", "Impact", sans-serif';
    }

    const words = noteText.split(' ');
    let line1 = '';
    let line2 = '';
    for (let w = 0; w < words.length; w++) {
      if ((line1 + ' ' + words[w]).trim().length < 32 && !line2) {
        line1 = (line1 + ' ' + words[w]).trim();
      } else {
        line2 = (line2 + ' ' + words[w]).trim();
      }
    }

    if (line2) {
      ctx.fillText(`“${line1}`, 175, noteY + 68);
      ctx.fillText(`${line2}”`, 175, noteY + 125);
    } else {
      ctx.fillText(`“${line1}”`, 175, noteY + 95);
    }

    // 6. METRICS 3x2 GRID
    const metricsY = 920;
    const gridCols = 3;
    const cardGap = 24;
    const cardWidth = (width - 120 - cardGap * 2) / gridCols;
    const cardHeight = 155;

    const metrics = [
      { label: t.metrics.humidity, val: `%${data.current.humidity}`, bg: '#FFE800' },
      { label: t.metrics.wind, val: `${data.current.windSpeed} ${lang === 'en' ? 'km/h' : 'km/s'}`, bg: '#00E5FF' },
      { label: t.metrics.rainProb, val: `%${data.hourly[0]?.precipitationProbability ?? 0}`, bg: '#00E676' },
      { label: t.metrics.uv, val: `${data.current.uvIndex} / 11`, bg: '#FF1E56', textColor: '#FFFFFF' },
      { label: t.metrics.pressure, val: `${data.current.pressure} hPa`, bg: '#FFFFFF' },
      { label: t.metrics.aqi, val: data.airQuality ? data.airQuality.aqiLevel : (lang === 'en' ? 'GOOD' : 'TEMİZ'), bg: '#FFE800' },
    ];

    metrics.forEach((m, idx) => {
      const col = idx % gridCols;
      const row = Math.floor(idx / gridCols);
      const mx = 60 + col * (cardWidth + cardGap);
      const my = metricsY + row * (cardHeight + cardGap);

      drawPopBox(mx, my, cardWidth, cardHeight, m.bg, 8, 20);

      ctx.fillStyle = m.textColor || '#000000';
      ctx.textAlign = 'center';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(m.label, mx + cardWidth / 2, my + 46);

      ctx.font = '900 36px "Bangers", sans-serif';
      ctx.fillText(m.val, mx + cardWidth / 2, my + 102);
    });

    // 7. FUN POP ART WEATHER RADAR & OUTFIT / MOOD PANEL
    const funSectionY = 1285;
    const funSectionH = 490;
    drawPopBox(60, funSectionY, width - 120, funSectionH, '#FFFDF0', 14, 32);

    ctx.fillStyle = '#000000';
    ctx.font = '900 42px "Bangers", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      lang === 'en' ? 'POP OUTFIT & MOOD RADAR' : 'GÜNÜN POP KOMBİNİ & ENERJİ RADARI',
      105,
      funSectionY + 60
    );

    drawStarburst(width - 150, funSectionY + 55, 10, 48, 24, '#00E5FF');
    ctx.fillStyle = '#000000';
    ctx.font = '900 20px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('%100 POP', width - 150, funSectionY + 58);

    const isRainy =
      data.current.precipitation > 0 || (data.hourly[0]?.precipitationProbability ?? 0) >= 40;
    const isHot = data.current.temperature >= 26;
    const isCold = data.current.temperature <= 10;

    let outfitBadge = lang === 'en' ? 'CLASSIC POP! 🧥' : 'KLASİK POP! 🧥';
    let outfitTitle = lang === 'en' ? 'Light Jacket & White Sneakers' : 'Hafif Ceket & Beyaz Sneaker';
    let outfitSub = lang === 'en' ? 'Street style is on point, hit the town!' : 'Sokak stili bugün zirvede, rahatça fırla!';

    if (isRainy) {
      outfitBadge = lang === 'en' ? 'RAIN RADAR! ☔' : 'YAĞMUR RADARI! ☔';
      outfitTitle = lang === 'en' ? 'Yellow Boots & Waterproof Parka' : 'Sarı Çizme & Su Geçirmez Yağmurluk';
      outfitSub = lang === 'en' ? 'Pop your umbrella, dodge the puddles!' : 'Şemsiyeni kap, su birikintilerine dikkat!';
    } else if (isHot) {
      outfitBadge = lang === 'en' ? 'SCORCHING! 🔥' : 'KAVRULUYORUZ! 🔥';
      outfitTitle = lang === 'en' ? 'Cotton Tee, Shorts & Retro Shades' : 'Tişört, Şort & Retro Güneş Gözlüğü';
      outfitSub = lang === 'en' ? 'Wear sunscreen and chill in the shade!' : 'Güneş kremini sür, gölgede serinle!';
    } else if (isCold) {
      outfitBadge = lang === 'en' ? 'FREEZING! ❄️' : 'DONUYORUZ! ❄️';
      outfitTitle = lang === 'en' ? 'Thick Knit Sweater, Beanie & Scarf' : 'Kalın Yün Kazak, Bere & Atkı';
      outfitSub = lang === 'en' ? 'Layer up and savor a steaming brew!' : 'Kat kat giyin, sıcacık kahveni unutma!';
    }

    let moodBadge = lang === 'en' ? 'ENERGY: %98 ⚡' : 'ENERJİ: %98 ⚡';
    let moodTitle = lang === 'en' ? 'DOPAMINE PEAK! 🚀' : 'DOPAMİN TAVAN! 🚀';
    let moodSub = lang === 'en' ? 'Crystal clear skies, get outside!' : 'Hava açık, dışarı çıkmak için harika!';

    if (isRainy) {
      moodBadge = lang === 'en' ? 'COZY MODE: %99 ☕' : 'COZY MOD: %99 ☕';
      moodTitle = lang === 'en' ? 'COFFEE & COMIC BOOKS 📚' : 'KAHVE & ÇİZGİ ROMAN SAATİ 📚';
      moodSub = lang === 'en' ? 'Enjoy the rainfall right by the window!' : 'Pencere kenarında yağmurun tadını çıkar!';
    } else if (isCold) {
      moodBadge = lang === 'en' ? 'WARM ESCAPE: %95 🍫' : 'SICAK KAÇIŞ: %95 🍫';
      moodTitle = lang === 'en' ? 'BLANKET & RELAXATION 🛋️' : 'BATTANİYE VE DİNLENME 🛋️';
      moodSub = lang === 'en' ? 'Unwind with a hot chocolate!' : 'Sıcak bir içecekle günün keyfini çıkar!';
    } else if (isHot) {
      moodBadge = lang === 'en' ? 'BEACH VIBE: %100 🌴' : 'PLAJ ENERJİSİ: %100 🌴';
      moodTitle = lang === 'en' ? 'ICED LEMONADE TIME 🍹' : 'BUZLU LİMONATA SAATİ 🍹';
      moodSub = lang === 'en' ? 'Sun is blazing, recharge your spirits!' : 'Güneş parıldıyor, enerjini topla!';
    }

    const cardW = (width - 120 - 50) / 2;
    const subCardY = funSectionY + 105;
    const subCardH = 190;

    // Card 1: Outfit
    drawPopBox(90, subCardY, cardW, subCardH, '#FFE800', 8, 20);
    ctx.fillStyle = '#000000';
    ctx.font = '900 24px "Bangers", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🕶️ ${outfitBadge}`, 115, subCardY + 45);

    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(outfitTitle, 115, subCardY + 95);

    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText(outfitSub, 115, subCardY + 140);

    // Card 2: Mood & Energy
    drawPopBox(90 + cardW + 20, subCardY, cardW, subCardH, '#00E5FF', 8, 20);
    ctx.fillStyle = '#000000';
    ctx.font = '900 24px "Bangers", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ ${moodBadge}`, 90 + cardW + 45, subCardY + 45);

    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(moodTitle, 90 + cardW + 45, subCardY + 95);

    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText(moodSub, 90 + cardW + 45, subCardY + 140);

    // Bottom Banner inside the fun panel (Comic Motto)
    const mottoY = subCardY + subCardH + 25;
    const mottoH = 125;
    drawPopBox(90, mottoY, width - 180, mottoH, '#00E676', 8, 20);

    drawStarburst(140, mottoY + 62, 10, 42, 20, '#FF1E56');
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 18px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BOOM!', 140, mottoY + 65);

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.font = '900 32px "Bangers", sans-serif';
    ctx.fillText(
      lang === 'en'
        ? '“WHATEVER THE WEATHER, KEEP YOUR POP ART ENERGY AT 100%!”'
        : '“HAVA NASIL OLURSA OLSUN, POP ART ENERJİN TAVAN OLSUN!”',
      205,
      mottoY + 52
    );

    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#064E3B';
    ctx.fillText(
      lang === 'en'
        ? `${displayCity} live weather briefing complete · Have an epic comic-book day!`
        : `${displayCity} anlık hava raporu tamamlandı · Çizgi roman tadında harika bir gün dileriz!`,
      205,
      mottoY + 92
    );

    // 8. SIGNATURE FOOTER BRANDING (USER REQUIREMENT PRESERVED)
    const footerY = height - 55;
    ctx.fillStyle = '#000000';
    ctx.font = '900 28px "Bangers", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POP WEATHER - Created by Oseyan', width / 2, footerY);
  }, [data, isCelsius, convertTemp, theme, customNote, lang, t]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        drawCard();
      }, 50);
    }
  }, [isOpen, drawCard]);

  if (!isOpen) return null;

  // Download image helper
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `pop-weather-${(data.city || 'city').toLowerCase().replace(/\s+/g, '-')}-16x9.png`;
    a.click();
  };

  // Copy to Clipboard
  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch {
      handleDownload();
    }
  };

  // Web Share API
  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `pop-weather-${(data.city || 'city').toLowerCase()}-16x9.png`, {
          type: 'image/png',
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${data.city} - Pop Weather`,
            text: `${data.city}: ${convertTemp(data.current.temperature)}°! "${customNote}"`,
            files: [file],
          });
        } else {
          await navigator.share({
            title: `${data.city} - Pop Weather`,
            text: `${data.city}: ${convertTemp(data.current.temperature)}°! "${customNote}"`,
            url: window.location.href,
          });
        }
      });
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-lg md:max-w-5xl bg-[#FFFDF0] border-4 border-black rounded-3xl shadow-[10px_10px_0_#000] flex flex-col overflow-hidden font-comic my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[96vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#FFE800] border-b-3 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF1E56] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0_#000]">
              <Sparkles size={18} className="fill-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-black uppercase tracking-wider leading-none">
                {t.share.title}
              </h2>
              <span className="text-[11px] font-sans font-bold text-zinc-800">
                {t.share.subtitle}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border-2 border-black text-black pop-btn shadow-[2px_2px_0_#000] flex items-center justify-center transition-transform"
            title={lang === 'en' ? 'Close' : 'Kapat'}
          >
            <X size={18} className="stroke-[3]" />
          </button>
        </div>

        {/* Modal Main Content: Split Preview + Controls */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* LEFT: Complete 16:9 Uncropped Preview Viewport */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-[290px] sm:max-w-[340px] bg-zinc-900 p-2.5 sm:p-3 rounded-3xl border-3 border-black shadow-[6px_6px_0_#000] flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-2 px-1 text-white font-sans font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <Maximize2 size={12} className="text-[#FFE800]" />
                  <span>1080 x 1920 (9:16)</span>
                </span>
                <span className="px-2 py-0.5 bg-[#00E5FF] text-black font-comic font-black rounded-lg text-[10px]">
                  {t.share.previewTitle}
                </span>
              </div>

              {/* Exact uncropped aspect-ratio canvas container */}
              <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border-2 border-white/20 bg-black flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain block"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Customization & Actions Panel */}
          <div className="md:col-span-6 space-y-4">
            {/* 1. Theme Color Selector */}
            <div className="p-4 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0_#000] space-y-2">
              <span className="text-xs font-black text-black uppercase tracking-wider block">
                {t.share.colorTheme}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['yellow', 'cyan', 'magenta', 'dark'] as ThemeColor[]).map((clr) => {
                  const names: Record<ThemeColor, string> = {
                    yellow: t.share.themes.yellow,
                    cyan: t.share.themes.cyan,
                    magenta: t.share.themes.magenta,
                    dark: t.share.themes.dark,
                  };
                  const colors: Record<ThemeColor, string> = {
                    yellow: 'bg-[#FFE800]',
                    cyan: 'bg-[#00E5FF]',
                    magenta: 'bg-[#FF1E56]',
                    dark: 'bg-[#18181B]',
                  };

                  return (
                    <button
                      key={clr}
                      onClick={() => setTheme(clr)}
                      className={`p-2 rounded-xl border-2 border-black font-comic text-xs font-black transition-all flex flex-col items-center gap-1.5 ${
                        theme === clr
                          ? 'ring-2 ring-black scale-105 shadow-[2px_2px_0_#000]'
                          : 'opacity-70 hover:opacity-100'
                      } ${clr === 'dark' ? 'text-white' : 'text-black'} ${colors[clr]}`}
                    >
                      <div className="w-4 h-4 rounded-full border border-black bg-white" />
                      <span className="truncate text-[11px]">{names[clr]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Speech Balloon Note */}
            <div className="p-4 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0_#000] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={14} className="stroke-[2.5]" />
                  <span>{t.share.speechNote}</span>
                </span>
                <span className="text-[10px] font-sans font-bold text-zinc-500">
                  {customNote.length}/50
                </span>
              </div>

              <input
                type="text"
                maxLength={50}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={lang === 'en' ? 'Type your comic note...' : 'Çizgi roman notunuzu yazın...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF0] border-2 border-black text-sm font-sans font-bold text-black focus:outline-none focus:bg-[#FFE800]/20 shadow-[1.5px_1.5px_0_#000]"
              />

              {/* Ready-made presets */}
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold text-zinc-600 block">
                  {t.share.presetsTitle}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presets.slice(0, 6).map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomNote(preset)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-[#FFE800] border border-black text-[11px] font-sans font-bold text-black transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownload}
                  className="py-3 px-3 rounded-2xl bg-[#00E5FF] text-black border-2 border-black pop-btn shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider"
                >
                  <Download size={16} className="stroke-[3]" />
                  <span>{t.share.downloadBtn}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="py-3 px-3 rounded-2xl bg-[#00E676] text-black border-2 border-black pop-btn shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="stroke-[3]" />
                      <span>{t.share.copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="stroke-[3]" />
                      <span>{t.share.copyBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {canNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3 px-4 rounded-2xl bg-[#FF1E56] text-white border-2 border-black pop-btn shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider"
                >
                  <Share2 size={16} className="stroke-[3]" />
                  <span>{t.share.shareBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
