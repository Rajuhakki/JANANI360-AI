import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources, SUPPORTED_LANGUAGES } from './locales';

const SAVED_LANG_KEY = 'janani360_lang';

// Helper to update document attributes for language and direction (RTL support)
export const updateDocumentLanguageAndDir = (langCode: string) => {
  const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
  document.documentElement.lang = langConfig.code;
  document.documentElement.dir = langConfig.dir;
  
  if (langConfig.dir === 'rtl') {
    document.documentElement.classList.add('rtl-mode');
  } else {
    document.documentElement.classList.remove('rtl-mode');
  }
};

const initialLang = localStorage.getItem(SAVED_LANG_KEY) || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: SAVED_LANG_KEY,
      caches: ['localStorage']
    }
  });

// Apply document attributes on initialization
updateDocumentLanguageAndDir(i18n.language || initialLang);

// Listen to language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(SAVED_LANG_KEY, lng);
  updateDocumentLanguageAndDir(lng);
});

export default i18n;
