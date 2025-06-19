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
    membre?: null | Record<string, unknown>;
    type?: string;
  }
  
  export interface RegisterData {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    password_confirmation: string;
    statut: string;
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
    logout: () => Promise<void>;
    clearError: () => void;
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

