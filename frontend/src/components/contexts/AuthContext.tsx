import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axiosClient from '@/services/axiosClient';
import type { AuthContextType, AuthState, LoginCredentials, User, AuthError, RegisterData, ResetPasswordData, ApiErrorResponse} from '@/types/auth';
import { getXsrfToken } from '@/types/auth';
import axios from 'axios';
import { AxiosError } from 'axios';

/**
 * Contexte d'authentification par défaut
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * État initial de l'authentification
 */
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

/**
 * Provider d'authentification qui gère l'état de connexion de l'utilisateur
 * @param children - Les composants enfants qui auront accès au contexte d'authentification
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  /**
   * Vérifie l'état d'authentification actuel de l'utilisateur
   */
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axiosClient.get<User>('/api/user');
      setState((prev: AuthState) => ({ ...prev, user: data, error: null }));
    } catch (error) {
      const authError = error as AuthError;
      // Ne pas afficher d'erreur pour les 401 (utilisateur non connecté)
      if (authError.response?.status === 401) {
        setState((prev: AuthState) => ({
          ...prev,
          user: null,
          error: null // Pas d'erreur pour un utilisateur non connecté
        }));
      } else {
        setState((prev: AuthState) => ({
          ...prev,
          user: null,
          error: authError.message || 'Erreur lors de la vérification de l\'authentification'
        }));
      }
    } finally {
      setState((prev: AuthState) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Initialise l'authentification au montage du composant
   * Ne fait PAS de vérification automatique pour éviter les erreurs 401
   */
  useEffect(() => {
    // Ne pas faire de vérification automatique au montage
    // L'utilisateur sera vérifié seulement lors de la connexion
    setState((prev: AuthState) => ({ ...prev, loading: false }));
  }, []);

  /**
   * Gère la connexion de l'utilisateur
   * @param credentials - Les identifiants de connexion
   */
  const login = async (credentials: LoginCredentials): Promise<User> => {
    setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));
    try {
      console.log('🔐 Tentative de connexion avec Sanctum...');
      
      // Le token CSRF est géré automatiquement par axiosClient
      await axiosClient.post('/api/login', credentials);
      console.log('✅ Connexion réussie, récupération des données utilisateur...');
      
      const { data } = await axiosClient.get<User>('/api/user');
      console.log('👤 Données utilisateur récupérées:', data);
      
      setState((prev: AuthState) => ({ ...prev, user: data, error: null, loading: false }));
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      const authError = error as AuthError;
      setState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: authError.message || 'Erreur lors de la connexion'
      }));
      throw error;
    }
  };

  /**
   * Gère la déconnexion de l'utilisateur
   */
  const logout = async () => {
    setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));
    try {
      // Le token CSRF est géré automatiquement par axiosClient
      await axiosClient.post('/api/logout');
      setState((prev: AuthState) => ({ ...prev, user: null }));
    } catch (error) {
      const authError = error as AuthError;
      setState((prev: AuthState) => ({
        ...prev,
        error: authError.message || 'Erreur lors de la déconnexion'
      }));
      throw error;
    } finally {
      setState((prev: AuthState) => ({ ...prev, loading: false }));
    }
  };

  /**
   * Réinitialise les erreurs d'authentification
   */
  const clearError = useCallback(() => {
    setState((prev: AuthState) => ({ ...prev, error: null }));
  }, []);

  // Affiche un loader pendant le chargement initial
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @throws Error si utilisé en dehors d'un AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}

// Fonctions d'authentification séparées du composant pour éviter les warnings

/**
 * Gère l'inscription d'un nouvel utilisateur
 */
export const register = async (formData: RegisterData): Promise<{ message: string }> => {
  try {
    // Le token CSRF est géré automatiquement par axiosClient
    const { data } = await axiosClient.post('/api/register', formData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        const { status, data: resp } = axiosError.response;
        if (status === 422 && resp && typeof resp === 'object' && 'errors' in resp) {
          const errors = resp.errors as Record<string, string[]>;
          const first = Object.values(errors)[0][0];
          throw new Error(first || 'Erreur de validation');
        }
        throw new Error((resp as { message: string })?.message || "Erreur d'inscription");
      }
    }
    throw error;
  }
};

/**
 * Gère la demande de réinitialisation de mot de passe
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  try {
    // Le token CSRF est géré automatiquement par axiosClient
    const { data } = await axiosClient.post('/api/forgot-password', 
      { email },
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Log détaillé de l'erreur pour le débogage
      console.error('Forgot Password Error:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers
      });

      if (axiosError.response?.status === 419) {
        // Tentative de rafraîchir le token CSRF
        try {
          // Réessayer la requête une fois
          const retryResponse = await axiosClient.post('/api/forgot-password', 
            { email },
          );
          return retryResponse.data;
        } catch (retryError) {
          throw new Error('Session expirée. Veuillez rafraîchir la page et réessayer.');
        }
      }
      
      throw new Error(axiosError.response?.data?.message || 'Erreur lors de la demande de réinitialisation');
    }
    throw new Error('Erreur lors de la demande de réinitialisation');
  }
};

/**
 * Gère la réinitialisation du mot de passe
 */
export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  try {
    // Le token CSRF est géré automatiquement par axiosClient
    const response = await axiosClient.post('/api/reset-password', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 422 && axiosError.response.data) {
        const resp = axiosError.response.data as { errors: Record<string, string[]> };
        const errs = resp.errors;
        throw new Error(Object.values(errs)[0][0] || 'Erreur de validation');
      }
      throw new Error((axiosError.response?.data as { message: string })?.message || 'Erreur lors de la réinitialisation');
    }
    throw error;
  }
}; 