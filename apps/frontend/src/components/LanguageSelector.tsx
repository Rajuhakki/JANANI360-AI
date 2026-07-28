import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../i18n/locales';

interface LanguageSelectorProps {
  variant?: 'header' | 'navbar' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'header', 
  className = '' 
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine current active language (checking cookie or i18n)
  let currentLangCode = i18n.language ? i18n.language.substring(0, 2) : 'en';
  const cookieMatch = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
  if (cookieMatch && cookieMatch[1]) {
    currentLangCode = cookieMatch[1];
  }

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (e: React.MouseEvent, lang: LanguageOption) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Update i18next language
    i18n.changeLanguage(lang.code);

    // 2. Set Google Translate cookie
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${lang.code}; path=/`;

    // 3. Instantly trigger Google Translate combo change in-place (NO PAGE RELOAD & NO NAVIGATE!)
    const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleSelect) {
      googleSelect.value = lang.code;
      googleSelect.dispatchEvent(new Event('change'));
    }

    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`relative inline-block text-left ${className}`} 
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden container for official Google Translate script mount */}
      <div id="google_translate_element" className="hidden" />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        aria-expanded={isOpen}
        aria-label="Select Language"
        className={`flex items-center gap-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
          variant === 'header'
            ? 'px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600 shadow-sm text-xs font-medium'
            : variant === 'navbar'
            ? 'px-2.5 py-1.5 bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold'
            : 'p-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs'
        }`}
      >
        <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="font-semibold text-slate-100">{currentLang.nativeName}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold uppercase border border-emerald-500/20">
          {currentLang.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl z-50 py-2 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
            <span>Select Language</span>
            <span className="text-emerald-400 font-normal">9 Languages</span>
          </div>

          <div className="max-h-72 overflow-y-auto py-1 custom-scrollbar">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLangCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => handleLanguageChange(e, lang)}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border-l-2 border-emerald-500'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {lang.dir === 'rtl' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        RTL
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
