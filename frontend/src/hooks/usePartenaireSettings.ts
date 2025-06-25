import { useState, useEffect } from 'react';
import axiosClient from '@/services/axiosClient';
import { PartenaireSettings, DEFAULT_PARTENAIRE_SETTINGS } from '@/types/PartenaireSettings';

export const usePartenaireSettings = () => {
  const [settings, setSettings] = useState<PartenaireSettings>(DEFAULT_PARTENAIRE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosClient.get('/api/pages/partenaires/settings', {
          headers: { Accept: 'application/json' }
        });

        const data = response.data.data || response.data;
        if (data && typeof data === 'object') {
          setSettings({ ...DEFAULT_PARTENAIRE_SETTINGS, ...data });
        } else {
          console.warn('Format de données invalide, utilisation des paramètres par défaut');
          setSettings(DEFAULT_PARTENAIRE_SETTINGS);
        }
      } catch (err) {
        console.error('Erreur chargement paramètres partenaires :', err);
        setError('Erreur chargement paramètres');
        setSettings(DEFAULT_PARTENAIRE_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, loading, error };
};
