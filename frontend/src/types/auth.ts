const API_BASE = 'http://localhost:8000';
/**
 * Types pour l'authentification
 */
export interface User {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
    is_blocked?: boolean;
    is_approved?: boolean;
    roles?: Array<{
      id: number;
      name: string;
      guard_name: string;
      created_at: string;
      updated_at: string;
    }>;
    membre?: Membre | null;
    type?: string;
  }
  
  export interface Membre {
    id: number;
    user_id: number;
    nom: string;
    prenom: string;
    statut?: string | null;
    email_complet?: string | null;
    biographie?: string | null;
    photo?: string | null;
    slug: string;
    google_id?: string | null;
    linkedin?: string | null;
    researchgate?: string | null;
    google_scholar?: string | null;
    grade?: string | null;
    is_comite: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface RegisterData {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    password_confirmation: string;
    statut: string;
  }

  // Types pour l'authentification sociale
  export interface SocialAuthResponse {
    success: boolean;
    message: string;
    user?: User;
  }

  export interface GoogleUser {
    id: string;
    name: string;
    email: string;
    picture?: string;
  }

  export const getUser = async () => {
    const res = await fetch(`${API_BASE}/api/user`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    });
  
    if (!res.ok) throw new Error('Non connecté');
    return res.json();
  };
  
  
  export interface ResetPasswordData {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }
  
  export interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
  }

  export interface LoginCredentials {
    email: string;
    password: string;
  }
  export const getXsrfToken = (): string | undefined => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
  }
  
  
  export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<User>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    checkAuth: (force?: boolean) => Promise<void>;
  }
  
  export interface AuthError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
    response?: {
      status?: number;
      data?: Record<string, unknown>;
    };
  } 

