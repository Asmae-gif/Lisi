import { useState, useEffect } from 'react';
import axiosClient from '@/services/axiosClient';
import { GallerySettings, DEFAULT_GALLERY_SETTINGS } from '@/types/GallerySettings';

export const useGalerieSettings = () => {
  const [settings, setSettings] = useState<GallerySettings>(DEFAULT_GALLERY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await axiosClient.get('/sanctum/csrf-cookie');
        
        const response = await axiosClient.get('/api/pages/galerie/settings', {
          headers: { 'Accept': 'application/json' }
        });

        const settingsData = response.data.data || response.data;

        if (settingsData && typeof settingsData === 'object') {
          setSettings({
            ...DEFAULT_GALLERY_SETTINGS,
            ...settingsData
          });
        } else {
          setSettings(DEFAULT_GALLERY_SETTINGS);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres de galerie:', err);
        setError('Erreur lors du chargement des paramètres');
        setSettings(DEFAULT_GALLERY_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, loading, error };
}; 