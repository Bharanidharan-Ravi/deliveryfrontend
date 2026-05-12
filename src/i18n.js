import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import taTranslations from './locales/ta.json';

i18n
  // Detects user language from browser/localStorage automatically
  .use(LanguageDetector)
  // Passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslations,
      ta: taTranslations
    },
    fallbackLng: 'en', // If a translation is missing, use English
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;