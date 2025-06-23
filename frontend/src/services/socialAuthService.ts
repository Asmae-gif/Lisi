import axiosClient from './axiosClient';
import type { SocialAuthResponse, GoogleUser } from '@/types/auth';

/**
 * Service pour l'authentification sociale Google
 */
export const socialAuthService = {
  /**
   * Redirige vers l'authentification Google
   */
  redirectToGoogle: async (): Promise<void> => {
    try {
      // Récupérer le token CSRF
      await axiosClient.get('/sanctum/csrf-cookie');
      
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('[DEBUG] VITE_API_URL:', apiUrl);
      
      const redirectUrl = `${apiUrl}/api/auth/google/redirect`;
      console.log('[DEBUG] URL de redirection Google:', redirectUrl);

      if (!apiUrl) {
        console.error("ERREUR: La variable d'environnement VITE_API_URL n'est pas définie. Veuillez créer un fichier .env à la racine de /frontend et y ajouter VITE_API_URL=http://localhost:8000 (ou l'URL de votre backend). N'oubliez pas de redémarrer le serveur de développement.");
        throw new Error("VITE_API_URL n'est pas configurée.");
      }

      // Rediriger vers l'endpoint Google
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Erreur lors de la redirection vers Google:', error);
      throw new Error('Impossible de rediriger vers Google');
    }
  },

  /**
   * Gère le callback de Google et vérifie l'authentification
   */
  handleGoogleCallback: async (): Promise<SocialAuthResponse> => {
    try {
      // Vérifier si l'utilisateur est maintenant connecté
      const { data } = await axiosClient.get('/api/user');
      
      return {
        success: true,
        message: 'Connexion Google réussie',
        user: data
      };
    } catch (error) {
      console.error('Erreur lors du callback Google:', error);
      return {
        success: false,
        message: 'Erreur lors de la connexion Google'
      };
    }
  },

  /**
   * Vérifie si l'utilisateur vient de se connecter via Google
   */
  checkSocialLoginStatus: (): boolean => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('social_login') === 'success';
  },

  /**
   * Nettoie les paramètres d'URL après une connexion sociale
   */
  cleanupSocialLoginParams: (): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete('social_login');
    window.history.replaceState({}, document.title, url.toString());
  }
};

export default socialAuthService; 