// Types communs pour l'application

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Partenaire {
  id: number;
  nom: string;
  logo: string | null;
  lien: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
  statut: 'non_lu' | 'lu' | 'repondu';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  created_at: string;
}

export interface Settings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  theme: {
    primary_color: string;
    secondary_color: string;
  };
} 