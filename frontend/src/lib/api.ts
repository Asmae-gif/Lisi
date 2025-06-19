// api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  async (config) => {
    // Récupérer le token XSRF-TOKEN du cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }

    // Ajouter le token d'authentification s'il existe
    const authToken = localStorage.getItem('token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fonction pour vérifier si l'utilisateur est authentifié
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const response = await api.get('/auth/user');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

export default api;
