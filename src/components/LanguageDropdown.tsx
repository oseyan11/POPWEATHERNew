import React, { useState, useRef, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, LanguageOption } from '../services/i18n';
import { ChevronDown, Check, Languages, Sparkles } from 'lucide-react';

interface LanguageDropdownProps {
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
  variant?: 'full' | 'compact';
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLang,
  onSelectLanguage,
  variant = 'full',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption: LanguageOption =
    SUPPORTED_LANGUAGES.find((opt) => opt.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block font-comic ${className}`}>
      {/* Trigger Button */}
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white border-2 border-black pop-btn shadow-[2px_2px_0_#000] text-black font-black text-xs transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
            isOpen ? 'bg-[#FFE800]' : ''
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          title={`Language: ${selectedOption.nativeName}`}
        >
          <span className="text-sm leading-none">{selectedOption.flag}</span>
          <span className="text-[11px] font-black tracking-wider uppercase">
            {selectedOption.badge}
          </span>
          <ChevronDown
            size={13}
            className={`stroke-[3] transition-transform duration-200 text-black ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full sm:w-64 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-white border-3 border-black pop-btn shadow-[3px_3px_0_#000] transition-all text-black active:translate-x-0.5 active:translate-y-0.5 ${
            isOpen ? 'bg-[#FFE800] shadow-[1.5px_1.5px_0_#000]' : 'hover:bg-[#FFFDF0]'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-zinc-100 border-2 border-black flex items-center justify-center text-sm shadow-[1px_1px_0_#000]">
              {selectedOption.flag}
            </span>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-black leading-tight tracking-wide">
                  {selectedOption.nativeName}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#FFE800] border border-black rounded text-black font-black uppercase">
                  {selectedOption.badge}
                </span>
              </div>
              <span className="text-[10px] font-sans font-bold text-zinc-500 block leading-tight">
                {selectedOption.name}
              </span>
            </div>
          </div>

          <div className="w-6 h-6 rounded-lg bg-zinc-100 border-2 border-black flex items-center justify-center">
            <ChevronDown
              size={14}
              className={`stroke-[3] text-black transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
      )}

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#FFFDF0] border-3 border-black rounded-3xl shadow-[5px_5px_0_#000] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Menu Header */}
          <div className="p-3 bg-[#FFE800] border-b-3 border-black flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-xs text-black uppercase tracking-wider">
              <Languages size={15} className="stroke-[2.5]" />
              <span>
                {currentLang === 'tr' ? 'DİL SEÇİN' : 'SELECT LANGUAGE'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white border border-black text-[10px] font-black">
              {SUPPORTED_LANGUAGES.length} {currentLang === 'tr' ? 'DİL' : 'LANGS'}
            </span>
          </div>

          {/* Languages List */}
          <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((option) => {
              const isSelected = option.code === currentLang;

              return (
                <button
                  key={option.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.code)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'bg-[#00E5FF] border-black shadow-[2px_2px_0_#000] scale-[1.01]'
                      : 'bg-white border-black/20 hover:border-black hover:bg-[#FFE800]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-base shadow-[1px_1px_0_#000] shrink-0">
                      {option.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-black">
                          {option.nativeName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-white/80 border border-black rounded font-black text-black">
                          {option.badge}
                        </span>
                      </div>
                      <span className="text-[10px] font-sans font-bold text-zinc-600">
                        {option.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#00E676] border-2 border-black flex items-center justify-center shadow-[1px_1px_0_#000]">
                      <Check size={14} className="stroke-[3.5] text-black" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Extensibility Footer Banner */}
          <div className="px-3 py-2 bg-white border-t-2 border-black flex items-center justify-between text-[10px] font-sans font-bold text-zinc-600">
            <div className="flex items-center gap-1">
              <Sparkles size={12} className="text-[#FF1E56] stroke-[2.5]" />
              <span>
                {currentLang === 'tr'
                  ? 'İleride yeni diller kolayca eklenebilir'
                  : 'More languages can easily be added'}
              </span>
            </div>
            <span className="px-1.5 py-0.5 bg-[#FFE800] border border-black rounded text-[9px] font-comic font-black text-black">
              +MORE
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
