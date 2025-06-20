import { useState, useEffect, useCallback } from 'react';
import axiosClient from '@/lib/axios';
import { ContactSettings } from '@/types/contactSettings';

interface ApiResponse {
  success?: boolean;
  data?: ContactSettings;
  message?: string;
}

export const useContactSettings = () => {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axiosClient.get('/sanctum/csrf-cookie');
      
      const response = await axiosClient.get<ApiResponse>('/api/pages/contact/settings', {
        headers: { 'Accept': 'application/json' }
      });

      const settingsData = response.data.data || response.data;

      if (settingsData && typeof settingsData === 'object') {
        setSettings(settingsData as ContactSettings);
      } else {
        throw new Error('Format de données invalide reçu du serveur');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      console.error('Erreur lors du chargement des paramètres de contact:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings
  };
}; 