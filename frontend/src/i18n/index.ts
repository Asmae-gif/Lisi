import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr_header from './locales/fr/header.json';
import en_header from './locales/en/header.json';
import ar_header from './locales/ar/header.json';

import fr_index from './locales/fr/index.json';
import en_index from './locales/en/index.json';
import ar_index from './locales/ar/index.json';

import fr_membres from './locales/fr/membres.json';
import en_membres from './locales/en/membres.json';
import ar_membres from './locales/ar/membres.json';

import fr_recherche from './locales/fr/recherche.json';
import en_recherche from './locales/en/recherche.json';
import ar_recherche from './locales/ar/recherche.json';

import fr_contact from './locales/fr/contact.json';
import en_contact from './locales/en/contact.json';
import ar_contact from './locales/ar/contact.json';

i18n
  .use(LanguageDetector)     // détecte la langue automatiquement
  .use(initReactI18next)     // passe i18n à react-i18next
  .init({
    resources: {
      fr: { 
        header: fr_header,
        index: fr_index,
        membres: fr_membres,
        recherche: fr_recherche,
        contact: fr_contact
      },
      en: { 
        header: en_header,
        index: en_index,
        membres: en_membres,
        recherche: en_recherche,
        contact: en_contact
      },
      ar: { 
        header: ar_header,
        index: ar_index,
        membres: ar_membres,
        recherche: ar_recherche,
        contact: ar_contact
      }
    },
    fallbackLng: 'fr',       // langue par défaut
    ns: ['header', 'index', 'membres', 'recherche', 'contact'], // namespace(s) utilisés
    defaultNS: 'header',
    interpolation: {
      escapeValue: false     // pas d'échappement HTML nécessaire
    }
  });

export default i18n;
