import React from 'react';
import { CloudSun, Radar, Compass, Cpu } from 'lucide-react';
import { Language, translations } from '../services/i18n';

export type TabKey = 'weather' | 'radar' | 'cities' | 'telemetry';

interface BottomTabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  lang: Language;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  lang,
}) => {
  const t = translations[lang];

  const tabs: { key: TabKey; label: string; icon: React.FC<{ size: number; className?: string }> }[] = [
    { key: 'weather', label: t.tabs.weather, icon: CloudSun },
    { key: 'radar', label: t.tabs.radar, icon: Radar },
    { key: 'cities', label: t.tabs.cities, icon: Compass },
    { key: 'telemetry', label: t.tabs.settings, icon: Cpu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF0] dark:bg-[#14151F] border-t-3 border-black px-2 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] pt-1 max-w-md mx-auto shadow-[0_-4px_0_#000]">
      <div className="grid grid-cols-4 items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className="min-h-[48px] flex flex-col items-center justify-center gap-1 group active:scale-95 transition-transform"
              aria-label={tab.label}
            >
              <div
                className={`p-1.5 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-[#FFE800] border-black shadow-[2px_2px_0_#000] -translate-y-1'
                    : 'bg-transparent border-transparent'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors stroke-[2.5] ${
                    isActive ? 'text-black' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-comic tracking-wide transition-colors ${
                  isActive ? 'text-black dark:text-black font-black' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white font-bold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
