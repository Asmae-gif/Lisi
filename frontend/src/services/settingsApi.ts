import axiosClient from './axiosClient';
import { IndexSettings } from '../types/indexSettings';
import { RechercheSettings } from '../types/rechercheSettings';
import { MembreSettings } from '../types/MembresSettings';
import { ActivityReportsSettings } from '../types/ActivityReportsSettings';

/**
 * Service API unifié pour tous les paramètres
 * Élimine la duplication de code entre les différents services de paramètres
 */

interface SettingsApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Fonctions utilitaires communes pour les paramètres
 */
const settingsUtils = {
  async getSettings<T>(page: string): Promise<T> {
    try {
      const response = await axiosClient.get(`/api/pages/${page}/settings`, {
        headers: { 'Accept': 'application/json' }
      });
      const settingsData = response.data.data || response.data;

      if (settingsData && typeof settingsData === 'object') {
        return settingsData as T;
      } else {
        throw new Error('Format de données invalide reçu du serveur');
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des paramètres ${page}:`, error);
      throw error;
    }
  },

  async updateSettings<T>(
    page: string, 
    settings: Partial<T>, 
    files?: Record<string, File>
  ): Promise<T> {
    try {
      const formData = new FormData();
      
      // Ajouter l'ID s'il existe
      const settingsWithId = settings as Record<string, unknown>;
      if (settingsWithId.id) {
        formData.append('id', String(settingsWithId.id));
      }
      
      formData.append('page', page);
      
      // Ajouter tous les champs de configuration
      Object.entries(settings).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          formData.append(key, String(value));
        }
      });
      
      // Gérer les fichiers
      if (files) {
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
      }
      
      const response = await axiosClient.post<SettingsApiResponse<T>>(
        `/api/pages/${page}/settings`,
        formData,
        { 
          headers: { 
            'Accept': 'application/json',
            'Content-Type': undefined,
          }
        }
      );

      return (response.data.data || response.data) as T;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des paramètres ${page}:`, error);
      throw error;
    }
  },

  async deleteImage(page: string, imageKey: string): Promise<SettingsApiResponse<unknown>> {
    try {
      const response = await axiosClient.delete<SettingsApiResponse<unknown>>(
        `/api/pages/${page}/settings/image/${imageKey}`, 
        {
          headers: { 'Accept': 'application/json' }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'image ${page}:`, error);
      throw error;
    }
  }
};

/**
 * Service pour les paramètres de la page d'accueil
 */
export const indexSettingsApi = {
  async getSettings(): Promise<IndexSettings> {
    return settingsUtils.getSettings<IndexSettings>('index');
  },

  async updateSettings(settings: Partial<IndexSettings>, files?: Record<string, File>): Promise<IndexSettings> {
    return settingsUtils.updateSettings<IndexSettings>('index', settings, files);
  },

  async saveSettings(formData: FormData): Promise<IndexSettings> {
    try {
      // Essayer d'abord avec la route /store
      try {
        const response = await axiosClient.post('/api/pages/index/settings', formData, {
          headers: { 
            'Accept': 'application/json',
            'Content-Type': undefined
          }
        });
        
        if (response.data?.success || response.data?.message === 'Settings updated successfully') {
          return response.data.data || response.data;
        } else {
          throw new Error(response.data?.message || 'Erreur lors de la sauvegarde');
        }
      } catch (storeError) {
        console.log('Route /store non disponible, essai avec /settings PUT');
        
        // Fallback: convertir FormData en objet et utiliser updateSettings
        const settingsObj: Partial<IndexSettings> = {};
        for (const [key, value] of formData.entries()) {
          if (key !== 'page') {
            settingsObj[key] = value as string;
          }
        }
        
        return await indexSettingsApi.updateSettings(settingsObj);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres d\'index:', error);
      throw error;
    }
  },

  async deleteImage(imageKey: string): Promise<SettingsApiResponse<unknown>> {
    return settingsUtils.deleteImage('index', imageKey);
  }
};

/**
 * Service pour les paramètres de la page recherche
 */
export const rechercheSettingsApi = {
  async getSettings(): Promise<RechercheSettings> {
    return settingsUtils.getSettings<RechercheSettings>('recherche');
  },

  async updateSettings(settings: Partial<RechercheSettings>, files?: Record<string, File>): Promise<RechercheSettings> {
    return settingsUtils.updateSettings<RechercheSettings>('recherche', settings, files);
  },

  async deleteImage(imageKey: string): Promise<SettingsApiResponse<unknown>> {
    return settingsUtils.deleteImage('recherche', imageKey);
  }
};

/**
 * Service pour les paramètres de la page équipe
 */
export const equipeSettingsApi = {
  async getSettings(): Promise<MembreSettings> {
    return settingsUtils.getSettings<MembreSettings>('membres');
  },

  async updateSettings(settings: Partial<MembreSettings>, files?: Record<string, File>): Promise<MembreSettings> {
    return settingsUtils.updateSettings<MembreSettings>('membres', settings, files);
  },

  async deleteImage(imageKey: string): Promise<SettingsApiResponse<unknown>> {
    return settingsUtils.deleteImage('membres', imageKey);
  }
};

/**
 * Service pour les paramètres de la page rapports d'activité
 */
export const activityReportsSettingsApi = {
  async getSettings(): Promise<ActivityReportsSettings> {
    return settingsUtils.getSettings<ActivityReportsSettings>('activity-reports');
  },

  async updateSettings(settings: Partial<ActivityReportsSettings>, files?: Record<string, File>): Promise<ActivityReportsSettings> {
    return settingsUtils.updateSettings<ActivityReportsSettings>('activity-reports', settings, files);
  },

  async deleteImage(imageKey: string): Promise<SettingsApiResponse<unknown>> {
    return settingsUtils.deleteImage('activity-reports', imageKey);
  }
};

// Export par défaut pour compatibilité
export default {
  index: indexSettingsApi,
  recherche: rechercheSettingsApi,
  equipe: equipeSettingsApi,
  activityReports: activityReportsSettingsApi
}; 