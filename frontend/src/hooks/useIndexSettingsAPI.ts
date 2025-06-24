import { useState, useEffect, useCallback } from 'react';
import { indexSettingsApi } from '../services/settingsApi';
import { IndexSettings, DEFAULT_INDEX_SETTINGS, AVAILABLE_LANGUAGES, LanguageSettings } from '../types/indexSettings';

/**
 * Hook pour gérer les paramètres de la page d'accueil
 * Récupère le contenu depuis l'API et fusionne avec les valeurs par défaut
 */
interface UseIndexSettingsAPIReturn {
  settings: IndexSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

/**
 * Fusionne les données de l'API avec les valeurs par défaut de manière profonde
 */
const mergeSettingsWithDefaults = (apiData: Partial<IndexSettings> | null | undefined): IndexSettings => {
  if (!apiData || typeof apiData !== 'object') {
    console.log('🔄 Aucune donnée API, utilisation des valeurs par défaut');
    return DEFAULT_INDEX_SETTINGS;
  }
  
  // Merge profond pour les champs de langue
  const mergedLanguages: Record<string, LanguageSettings> = {};
  AVAILABLE_LANGUAGES.forEach(lang => {
    const langCode = lang.code;
    const defaultLang = DEFAULT_INDEX_SETTINGS[langCode] as LanguageSettings;
    const apiLang = apiData[langCode] as LanguageSettings | undefined;
    
    // Merge profond: prendre les valeurs de l'API si elles existent, sinon les valeurs par défaut
    mergedLanguages[langCode] = {
      ...defaultLang,
      ...(apiLang && typeof apiLang === 'object' ? apiLang : {})
    };
  });
  
  const result = {
    ...DEFAULT_INDEX_SETTINGS,
    ...apiData,
    ...mergedLanguages
  };
  
  console.log('🔄 Fusion des données:', {
    apiData: Object.keys(apiData),
    merged: Object.keys(result),
    languages: Object.keys(mergedLanguages)
  });
  
  return result;
};

export const useIndexSettingsAPI = (): UseIndexSettingsAPIReturn => {
  const [settings, setSettings] = useState<IndexSettings>(DEFAULT_INDEX_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres depuis l'API
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des paramètres depuis l\'API...');
      const settingsData = await indexSettingsApi.getSettings();
      console.log('📊 Données reçues de l\'API:', settingsData);
      
      // Fusionner avec les valeurs par défaut de manière profonde
      const mergedSettings = mergeSettingsWithDefaults(settingsData);
      
      setSettings(mergedSettings);
      console.log('✅ Paramètres fusionnés et appliqués');
    } catch (err: unknown) {
      console.error('❌ Erreur lors du chargement des paramètres:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      
      // En cas d'erreur, utiliser les valeurs par défaut
      console.log('🔄 Utilisation des valeurs par défaut suite à l\'erreur');
      setSettings(DEFAULT_INDEX_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualiser les paramètres
  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    refreshSettings,
  };
}; 