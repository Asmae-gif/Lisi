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
        await axiosClient.get('/sanctum/csrf-cookie');
        const response = await axiosClient.get('/api/pages/partenaires/settings', {
          headers: { Accept: 'application/json' }
        });

        const data = response.data.data || response.data;
        if (data && typeof data === 'object') {
          setSettings({ ...DEFAULT_PARTENAIRE_SETTINGS, ...data });
        } else {
          throw new Error('Format de données invalide');
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
