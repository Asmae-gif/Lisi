import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Variable pour stocker le token CSRF et éviter les requêtes répétées
let csrfToken: string | null = null;
let isRefreshingToken = false;

function getXsrfToken(): string | undefined {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
}

/**
 * Rafraîchit le token CSRF de manière optimisée
 */
async function refreshCsrfToken(): Promise<string | null> {
  if (isRefreshingToken) {
    // Attendre que le refresh en cours se termine
    return new Promise((resolve) => {
      const checkToken = () => {
        if (!isRefreshingToken) {
          resolve(csrfToken);
        } else {
          setTimeout(checkToken, 100);
        }
      };
      checkToken();
    });
  }

  isRefreshingToken = true;
  
  try {
    await axiosClient.get('/sanctum/csrf-cookie');
    csrfToken = getXsrfToken() || null;
    return csrfToken;
  } finally {
    isRefreshingToken = false;
  }
}

// Intercepteur pour les requêtes
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      // Pour les requêtes non-GET, s'assurer d'avoir un CSRF token
      if (config.method !== 'get') {
        // Vérifier d'abord le token en cache
        if (!csrfToken) {
          csrfToken = getXsrfToken() || null;
        }

        // Si pas de token, le rafraîchir
        if (!csrfToken) {
          csrfToken = await refreshCsrfToken();
        }

        if (csrfToken) {
          config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
        }
      }
      
      return config;
    } catch (error) {
      console.error('Erreur dans l\'intercepteur de requête:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Ne pas réessayer les requêtes /api/user en cas d'erreur 401
    if (error.config?.url === '/api/user' && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // Si erreur 419 (CSRF token expiré), essayer de rafraîchir le token et réessayer
    if (error.response?.status === 419) {
      try {
        // Réinitialiser le token en cache
        csrfToken = null;
        
        // Rafraîchir le token
        const newToken = await refreshCsrfToken();
        
        if (newToken && error.config) {
          error.config.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
          return axiosClient(error.config);
        }
      } catch (refreshError) {
        console.error('Échec du rafraîchissement du token:', refreshError);
      }
    }

    // Gérer les erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      console.error('La requête a expiré');
      return Promise.reject(new Error('La requête a pris trop de temps. Veuillez réessayer.'));
    }

    // Gérer les erreurs de réseau
    if (!error.response) {
      console.error('Erreur de réseau');
      return Promise.reject(new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.'));
    }

    return Promise.reject(error);
  }
);

export default axiosClient; 