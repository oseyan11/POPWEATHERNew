import React, { useState } from 'react';
import { Smartphone, Download, Check, Sparkles, HelpCircle, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../services/i18n';

interface AndroidInstallCardProps {
  lang: Language;
}

export const AndroidInstallCard: React.FC<AndroidInstallCardProps> = ({ lang }) => {
  const { canInstall, isInstalled, installApp } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  const t = {
    title: lang === 'en' ? 'ANDROID & MOBILE APP' : 'ANDROİD UYGULAMA KURULUMU',
    installedBadge: lang === 'en' ? 'INSTALLED (STANDALONE)' : 'UYGULAMA YÜKLENDİ',
    desc:
      lang === 'en'
        ? 'Install directly to your Android device home screen as a native full-screen app with offline support, or export as APK via WebAPK / Bubblewrap.'
        : 'Telefonunuza yerel tam ekran bir Android uygulaması (APK / WebAPK) olarak yükleyin. Çentik ve navbar uyumlu tam ekran deneyimi sağlar.',
    installBtn: lang === 'en' ? 'INSTALL APP NOW (APK)' : 'UYGULAMAYI YÜKLE (APK/PWA)',
    installedBtn: lang === 'en' ? 'ALREADY INSTALLED' : 'ZATEN YÜKLÜ',
    howToBtn: lang === 'en' ? 'How to install manually?' : 'Nasıl yüklenir? (APK/Tarayıcı)',
    step1:
      lang === 'en'
        ? '1. In Chrome / Samsung Internet on Android, tap the ⋮ menu at top right.'
        : '1. Android telefonunuzda Chrome veya Samsung Internet açıp sağ üstteki ⋮ menüsüne dokunun.',
    step2:
      lang === 'en'
        ? '2. Select "Install app" or "Add to Home screen".'
        : '2. "Uygulamayı yükle" veya "Ana ekrana ekle" seçeneğine basın.',
    step3:
      lang === 'en'
        ? '3. Android will automatically compile a native WebAPK with the Pop Weather icon!'
        : '3. Android, Pop Weather simgesiyle telefonunuza doğrudan yerel APK olarak kuracaktır!',
    bubblewrapTip:
      lang === 'en'
        ? 'For Google Play Store distribution or standalone signed .apk file, use Google Bubblewrap CLI (TWA) with our manifest.json.'
        : 'Google Play Store veya bağımsız imzalı .apk dosyası üretmek için projenin manifest.json dosyası Google Bubblewrap (TWA) aracıyla doğrudan APK/AAB çıktısına dönüştürülebilir.',
  };

  return (
    <div className="p-4.5 rounded-3xl bg-[#00E5FF] border-3.5 border-black shadow-[5px_5px_0_#000] text-black space-y-3 font-comic relative overflow-hidden">
      {/* Background Halftone Accent */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-benday-dots opacity-20 rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black text-[#FFE800] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0_#000]">
            <Smartphone size={18} />
          </div>
          <span className="font-comic font-black text-sm tracking-wider uppercase text-black">
            {t.title}
          </span>
        </div>

        {isInstalled && (
          <span className="px-2 py-0.5 rounded-lg bg-[#00E676] text-black border border-black font-black text-[10px] uppercase flex items-center gap-1">
            <Check size={12} className="stroke-[3]" />
            {t.installedBadge}
          </span>
        )}
      </div>

      <p className="font-sans font-bold text-xs text-zinc-900 leading-relaxed">
        {t.desc}
      </p>

      {/* Action Buttons */}
      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {canInstall ? (
          <button
            onClick={installApp}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-[#FFE800] text-black font-black text-xs border-2 border-black pop-btn shadow-[3px_3px_0_#000] flex items-center justify-center gap-2"
          >
            <Download size={16} className="stroke-[3]" />
            {t.installBtn}
          </button>
        ) : isInstalled ? (
          <div className="flex-1 py-2.5 px-4 rounded-2xl bg-[#FFFDF0] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center gap-2">
            <Check size={16} className="text-[#00C853] stroke-[3]" />
            {t.installedBtn}
          </div>
        ) : (
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-[#FFE800] text-black font-black text-xs border-2 border-black pop-btn shadow-[3px_3px_0_#000] flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="stroke-[3]" />
            {t.installBtn}
          </button>
        )}

        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="py-2.5 px-3 rounded-2xl bg-white text-black font-sans font-black text-xs border-2 border-black pop-btn shadow-[2px_2px_0_#000] flex items-center justify-center gap-1.5"
        >
          <HelpCircle size={15} />
          <span>{showInstructions ? (lang === 'en' ? 'Hide' : 'Gizle') : t.howToBtn}</span>
        </button>
      </div>

      {/* Step by step manual guide */}
      {showInstructions && (
        <div className="mt-3 p-3.5 bg-[#FFFDF0] border-2 border-black rounded-2xl shadow-[3px_3px_0_#000] space-y-2 text-xs font-sans font-bold text-zinc-900 animate-in fade-in duration-200">
          <p className="font-comic font-black text-sm text-[#FF1E56] uppercase tracking-wide">
            {lang === 'en' ? 'HOW TO GET THE ANDROID APK / APP:' : 'ANDROİD TELEFONA YÜKLEME ADIMLARI:'}
          </p>
          <div className="space-y-1.5 leading-snug">
            <p>{t.step1}</p>
            <p>{t.step2}</p>
            <p>{t.step3}</p>
          </div>
          <div className="pt-2 border-t border-black/20 text-[11px] text-zinc-700">
            <span className="font-black text-black">APK/Play Store Dağıtımı: </span>
            {t.bubblewrapTip}
          </div>
        </div>
      )}
    </div>
  );
};
