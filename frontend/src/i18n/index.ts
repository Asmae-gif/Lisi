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

import fr_galerie from './locales/fr/galerie.json';
import en_galerie from './locales/en/galerie.json';
import ar_galerie from './locales/ar/galerie.json';

import fr_project from './locales/fr/project.json';
import en_project from './locales/en/project.json';
import ar_project from './locales/ar/project.json';

import fr_publications from './locales/fr/publications.json';
import en_publications from './locales/en/publications.json';
import ar_publications from './locales/ar/publications.json';

import fr_translation from './locales/fr/translation.json';
import en_translation from './locales/en/translation.json';
import ar_translation from './locales/ar/translation.json';

import fr_prixDistinctions from './locales/fr/prixDistinctions.json';
import en_prixDistinctions from './locales/en/prixDistinctions.json';
import ar_prixDistinctions from './locales/ar/prixDistinctions.json';

import fr_partenaires from './locales/fr/partenaires.json';
import en_partenaires from './locales/en/partenaires.json';
import ar_partenaires from './locales/ar/partenaires.json';
 



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
        contact: fr_contact,
        galerie: fr_galerie,
        project: fr_project,
        publications: fr_publications,
        translation: fr_translation,
        prixDistinctions: fr_prixDistinctions,
        partenaires: fr_partenaires
      },
      en: { 
        header: en_header,
        index: en_index,
        membres: en_membres,
        recherche: en_recherche,
        contact: en_contact,
        galerie: en_galerie,
        project: en_project,
        publications: en_publications,
        translation: en_translation,
        prixDistinctions: en_prixDistinctions,
        partenaires: en_partenaires
      },
      ar: { 
        header: ar_header,
        index: ar_index,
        membres: ar_membres,
        recherche: ar_recherche,
        contact: ar_contact,
        galerie: ar_galerie,
        project: ar_project,
        publications: ar_publications,
        translation: ar_translation,
        prixDistinctions: ar_prixDistinctions,
        partenaires: ar_partenaires
      }
    },
    fallbackLng: 'fr',       // langue par défaut
    ns: ['header', 'index', 'membres', 'recherche', 'contact', 'galerie', 'project', 'publications', 'translation', 'prixDistinctions', 'partenaires'], // namespace(s) utilisés
    defaultNS: 'header',
    interpolation: {
      escapeValue: false     // pas d'échappement HTML nécessaire
    }
  });

export default i18n;
