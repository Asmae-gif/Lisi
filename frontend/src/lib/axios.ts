import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Fonction pour obtenir le token CSRF
const getCsrfToken = async () => {
  try {
    await api.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Erreur lors de la récupération du token CSRF:', error);
  }
};

// Intercepteur pour ajouter le token CSRF
api.interceptors.request.use(async (config) => {
  // Récupérer le cookie CSRF
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
  }

  // Ne pas définir Content-Type pour multipart/form-data
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (config.data && typeof config.data === 'object') {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error('Erreur détaillée:', error.response.data);
      switch (error.response.status) {
        case 401:
          // Rediriger vers la page de connexion
          window.location.href = '/login';
          break;
        case 403:
          console.error('Accès refusé');
          break;
        case 419:
          // Erreur CSRF, rafraîchir le token
          await getCsrfToken();
          // Réessayer la requête originale
          if (error.config) {
            return api(error.config);
          }
          break;
        case 500:
          console.error('Erreur serveur:', error.response.data);
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api; 