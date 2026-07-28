import React, { useEffect, useState } from 'react';
import { Globe, Languages, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GoogleTranslateWidgetProps {
  className?: string;
  variant?: 'compact' | 'full' | 'dropdown';
}

const SUPPORTED_TRANSLATE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
];

export const GoogleTranslateWidget: React.FC<GoogleTranslateWidgetProps> = ({
  className = '',
  variant = 'compact'
}) => {
  const { i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Read active Google Translate cookie if set
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      setActiveLang(match[1]);
    } else if (i18n.language) {
      setActiveLang(i18n.language.substring(0, 2));
    }
  }, [i18n.language]);

  const changeGoogleTranslateLanguage = (langCode: string) => {
    // Set google translate cookie
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`;

    // Also update react-i18next
    i18n.changeLanguage(langCode);
    setActiveLang(langCode);
    setIsOpen(false);

    // Refresh page to allow Google Translate engine to translate 100% of DOM
    window.location.reload();
  };

  const currentLangObj = SUPPORTED_TRANSLATE_LANGUAGES.find(l => l.code === activeLang) || SUPPORTED_TRANSLATE_LANGUAGES[0];

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* Official Google Translate Mount Target */}
      <div id="google_translate_element" className="hidden" />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 text-slate-100 hover:border-emerald-400 transition text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40"
        title="Google Translate (Translates 100% of entire page)"
      >
        <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="text-emerald-300 font-extrabold">{currentLangObj.nativeName}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold uppercase border border-emerald-500/30">
          {currentLangObj.code}
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-extrabold uppercase border border-indigo-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          Google Translate
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/40 shadow-2xl backdrop-blur-xl z-50 py-2 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-2 border-b border-slate-800 flex justify-between items-center text-xs font-black">
            <span className="text-white flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-emerald-400" />
              100% Full-Page Google Translator
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Real-Time</span>
          </div>

          <div className="max-h-72 overflow-y-auto py-1 custom-scrollbar">
            {SUPPORTED_TRANSLATE_LANGUAGES.map((lang) => {
              const isSelected = lang.code === activeLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeGoogleTranslateLanguage(lang.code)}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 font-black border-l-4 border-emerald-500'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    {lang.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
