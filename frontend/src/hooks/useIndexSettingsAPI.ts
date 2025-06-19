import { useState, useEffect, useCallback } from 'react';
import { indexSettingsApi } from '@/services/settingsApi';
import { IndexSettings, DEFAULT_INDEX_SETTINGS, mergeSettingsWithDefaults } from '@/types/indexSettings';

/**
 * Hook pour gérer les paramètres de la page d'accueil
 * Récupère le contenu français depuis l'API et gère les états de chargement
 */
interface UseIndexSettingsAPIReturn {
  settings: IndexSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

export const useIndexSettingsAPI = (): UseIndexSettingsAPIReturn => {
  const [settings, setSettings] = useState<IndexSettings>(DEFAULT_INDEX_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres depuis l'API
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await indexSettingsApi.getSettings();
      
      // Utiliser la fonction utilitaire pour fusionner les données
      const mergedSettings = mergeSettingsWithDefaults(settingsData);
      setSettings(mergedSettings);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des paramètres:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      // En cas d'erreur, utiliser les valeurs par défaut
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