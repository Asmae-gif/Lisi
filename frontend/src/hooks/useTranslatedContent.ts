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

  // Logs pour diagnostiquer
  console.log('🔍 useTranslatedContent: Settings reçus:', settings);
  console.log('🔍 useTranslatedContent: Exemple de contenu:', {
    hero_titre_principal: settings.hero_titre_principal,
    hero_sous_titre: settings.hero_sous_titre
  });

  // Fonction pour obtenir le contenu traduit d'un champ spécifique
  const getTranslatedField = (fieldName: keyof IndexSettings, fallbackKey: string): string => {
    const content = settings[fieldName] as string;
    
    console.log(`🔤 getTranslatedField(${fieldName}):`, {
      content,
      fallbackKey,
      fallbackValue: t(fallbackKey)
    });
    
    // Si on a du contenu en base de données, l'afficher
    if (content) {
      console.log(`✅ Utilisation du contenu de la base: ${content}`);
      return content;
    }
    
    // Sinon, utiliser la traduction par défaut
    console.log(`🔄 Utilisation de la traduction par défaut: ${t(fallbackKey)}`);
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