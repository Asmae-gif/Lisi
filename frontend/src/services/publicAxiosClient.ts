import axios from 'axios';

const publicAxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Pas de cookies pour les requêtes publiques
});

// Intercepteur pour les réponses
publicAxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log seulement en développement
    if (import.meta.env.DEV) {
      console.log('Erreur API publique:', error.response?.status, error.config?.url);
    }
    
    // Pour les erreurs 401 sur les endpoints publics, retourner null au lieu de rejeter
    if (error.response?.status === 401) {
      return { data: null };
    }
    
    return Promise.reject(error);
  }
);

export default publicAxiosClient; 