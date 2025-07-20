import { useTranslation } from 'react-i18next';
import { useIndexSettingsAPI } from './useIndexSettingsAPI';
import { IndexSettings } from '@/types/indexSettings';

/**
 * Hook pour traduire le contenu français de la base de données
 * Affiche le contenu français directement, la traduction se fait via i18n
 */
export const useTranslatedContent = () => {
  const { t, i18n } = useTranslation('index');
  const { settings, loading, error } = useIndexSettingsAPI();

  // Fonction pour obtenir le contenu traduit d'un champ spécifique
const getTranslatedField = (fieldName: keyof IndexSettings, fallbackKey: string): string => {
  const content = settings[fieldName] as string;

  // Si on a du contenu en base de données, l'afficher
  if (content) {
    return content;
  }

  // Sinon, utiliser la traduction par défaut
  return t(fallbackKey);
};


  return {
    settings,
    loading,
    error,
    getTranslatedField,
    currentLanguage: i18n.language,
  };
}; 