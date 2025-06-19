import { useCallback } from 'react';
import { axesApi } from '../services/api';
import axiosClient from '../services/axiosClient';

/**
 * Hook pour les opérations API Laravel
 * Fournit des méthodes pour gérer les appels API avec gestion automatique du CSRF
 */
export function useLaravelApi() {
  const ensureCsrf = useCallback(async () => {
    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du CSRF:', error);
      return false;
    }
  }, []);

  return {
    ensureCsrf,
    getAxes: axesApi.fetchAll,
    getAxe: axesApi.fetchById
  };
} 