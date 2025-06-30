import { useState, useEffect } from 'react';
import axiosClient from '@/services/axiosClient';
import { PublicationSettings, DEFAULT_PUBLICATIONS_SETTINGS } from '@/types/PublicationsSettings';

export const usePublicationsSettings = () => {
  const [settings, setSettings] = useState<PublicationSettings>(DEFAULT_PUBLICATIONS_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Temporairement, utiliser seulement les valeurs par défaut
        setSettings(DEFAULT_PUBLICATIONS_SETTINGS);
        setLoading(false);
        return;
        
        const response = await axiosClient.get('/api/pages/publications/settings', {
          headers: { 'Accept': 'application/json' }
        });

        const settingsData = response.data.data || response.data;

        if (settingsData && typeof settingsData === 'object') {
          setSettings({
            ...DEFAULT_PUBLICATIONS_SETTINGS,
            ...settingsData
          });
        } else {
          console.warn('Format de données invalide, utilisation des paramètres par défaut');
          setSettings(DEFAULT_PUBLICATIONS_SETTINGS);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres de publications:', err);
        setError('Erreur lors du chargement des paramètres');
        setSettings(DEFAULT_PUBLICATIONS_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, loading, error };
}; 