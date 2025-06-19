import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr_header from './locales/fr/header.json';
import en_header from './locales/en/header.json';
import ar_header from './locales/ar/header.json';

import fr_index from './locales/fr/index.json';
import en_index from './locales/en/index.json';
import ar_index from './locales/ar/index.json';

i18n
  .use(LanguageDetector)     // détecte la langue automatiquement
  .use(initReactI18next)     // passe i18n à react-i18next
  .init({
    resources: {
      fr: { 
        header: fr_header,
        index: fr_index
      },
      en: { 
        header: en_header,
        index: en_index
      },
      ar: { 
        header: ar_header,
        index: ar_index
      }
    },
    fallbackLng: 'fr',       // langue par défaut
    ns: ['header', 'index'], // namespace(s) utilisés
    defaultNS: 'header',
    interpolation: {
      escapeValue: false     // pas d'échappement HTML nécessaire
    }
  });

export default i18n;
