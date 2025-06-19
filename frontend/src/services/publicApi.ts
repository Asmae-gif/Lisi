import axiosClient from './axiosClient';

// Service API générique pour les pages publiques
export const publicApi = {
  // Méthode générique pour récupérer des données avec gestion d'erreur 401
  get: async <T>(url: string, defaultValue: T): Promise<T> => {
    try {
      const { data } = await axiosClient.get(url);
      return data;
    } catch (error: unknown) {
      console.warn(`Erreur lors de la récupération de ${url}:`, error);
      // En cas d'erreur 401 ou autre, retourner la valeur par défaut
      return defaultValue;
    }
  },

  // Méthode pour récupérer les paramètres d'une page
  getPageSettings: async <T>(page: string, defaultValue: T): Promise<T> => {
    return publicApi.get(`/api/pages/${page}/settings`, defaultValue);
  },

  // Méthode pour récupérer les axes de recherche
  getAxes: async <T>(defaultValue: T): Promise<T> => {
    return publicApi.get('/api/axes', defaultValue);
  },

  // Méthode pour récupérer les membres
  getMembres: async <T>(defaultValue: T): Promise<T> => {
    return publicApi.get('/api/membres', defaultValue);
  },

  // Méthode pour récupérer les galeries
  getGalleries: async <T>(defaultValue: T): Promise<T> => {
    return publicApi.get('/api/galleries', defaultValue);
  }
}; 