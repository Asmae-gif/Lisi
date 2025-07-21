/**
 * Service API unifié pour toutes les opérations
 * Ce service centralise la gestion des appels API et des erreurs
 */

import axiosClient from './axiosClient';
import type { Membre, Axe, User, ApiResponse } from '../types/membre';
import type { Publication } from '@/components/publications-table'
import type { PrixDistinction } from '../types/prixDistinction';
import axios from 'axios';

// Types pour les données de contact
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Gère les erreurs API de manière uniforme
 */
const handleApiError = (error: unknown): ApiResponse<unknown> => {
  if (axios.isAxiosError(error) && error.response) {
    console.error('Erreur API:', {
      status: error.response.status,
      data: error.response.data,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response.status === 401) {
      return {
        success: false,
        message: 'Session expirée. Veuillez vous reconnecter.',
        error: 'AUTH_ERROR'
      };
    }

    return {
      success: false,
      message: error.response.data.message || 'Une erreur est survenue',
      error: error.response.data.error || 'API_ERROR'
    };
  }

  if (axios.isAxiosError(error) && error.request) {
    console.error('Pas de réponse du serveur:', error.request);
    return {
      success: false,
      message: 'Le serveur ne répond pas',
      error: 'NETWORK_ERROR'
    };
  }

  console.error('Erreur de configuration:', error);
  return {
    success: false,
    message: 'Erreur de configuration de la requête',
    error: 'CONFIG_ERROR'
  };
};

// ===== GESTION DES AXES =====
export const axesApi = {
  // Endpoint pour récupérer les axes (utilise l'endpoint admin)
  getAxes: async (): Promise<ApiResponse<Axe[]>> => {
    try {
      const { data } = await axiosClient.get('/api/axes');
      return {
        success: true,
        data,
        message: 'Axes récupérés avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<Axe[]>;
    }
  },

  getById: async (id: number): Promise<ApiResponse<Axe>> => {
    try {
      const { data } = await axiosClient.get(`/api/admin/axes/${id}`);
      return {
        success: true,
        data,
        message: 'Axe récupéré avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<Axe>;
    }
  },

  getMembres: async (axeId: number): Promise<ApiResponse<Membre[]>> => {
    try {
      const { data } = await axiosClient.get(`/api/admin/axes/${axeId}/membres`);
      return {
        success: true,
        data,
        message: 'Membres de l\'axe récupérés avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<Membre[]>;
    }
  }
};

// ===== GESTION DES MEMBRES =====
export const membresApi = {
  getAll: async (): Promise<ApiResponse<Membre[]>> => {
    try {
      const { data } = await axiosClient.get('/api/membres');
      return {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
        message: 'Membres récupérés avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<Membre[]>;
    }
  },

  getById: async (id: number): Promise<ApiResponse<Membre>> => {
    try {
      const { data } = await axiosClient.get(`/api/membres/${id}`);
      return {
        success: true,
        data,
        message: 'Membre récupéré avec succès'
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            success: false,
            message: 'Membre non trouvé',
            error: 'NOT_FOUND'
          };
        }
        if (error.response?.status === 401) {
          return {
            success: false,
            message: 'Non autorisé à accéder à ces données',
            error: 'UNAUTHORIZED'
          };
        }
      }
      return handleApiError(error) as ApiResponse<Membre>;
    }
  },

  update: async (id: number, membreData: Partial<Membre>): Promise<ApiResponse<Membre>> => {
    try {
      // Ne pas envoyer l'email s'il n'a pas changé pour éviter les conflits de validation
      const payload: Record<string, unknown> = {
        nom: membreData.nom,
        prenom: membreData.prenom,
        statut: membreData.statut || '',
        grade: membreData.grade || null,
        biographie: membreData.biographie || '',
        linkedin: membreData.linkedin || '',
        researchgate: membreData.researchgate || '',
        google_scholar: membreData.google_scholar || '',
        photo: membreData.photo || '',
      };

      // N'ajouter l'email que s'il est fourni et différent
      if (membreData.email) {
        payload.email = membreData.email;
      }

      const { data } = await axiosClient.put(`/api/membre`, payload);
      
      // Le backend retourne { status, message, membre, user, axes_disponibles, axes_selectionnes }
      const responseData = data.membre || data;
      
      return {
        success: true,
        data: responseData,
        message: data.message || 'Profil mis à jour avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<Membre>;
    }
  }
};

// ===== GESTION DES UTILISATEURS =====
export const usersApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    try {
      const { data } = await axiosClient.get('/api/admin/users');
      return {
        success: true,
        data: data.data || [],
        message: 'Utilisateurs récupérés avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<User[]>;
    }
  },

  approve: async (userId: number): Promise<ApiResponse<User>> => {
    try {
      const { data } = await axiosClient.post(`/api/admin/users/${userId}/approve`);
      return {
        success: true,
        data: data.data,
        message: 'Utilisateur approuvé avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<User>;
    }
  },

  toggleBlock: async (userId: number): Promise<ApiResponse<User>> => {
    try {
      const { data } = await axiosClient.post(`/api/admin/users/${userId}/block`);
      return {
        success: true,
        data: data.data,
        message: 'Statut de blocage modifié avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<User>;
    }
  }
};

// ===== GESTION DES CONTACTS =====
export const contactAPI = {
  
  // Envoyer un message de contact
  sendMessage: (data: ContactFormData) => 
    axiosClient.post('/api/contact', data),
  
  // Récupérer tous les messages (admin)
  getMessages: async (page = 1, perPage = 10) => {
   
    try {
      const response = await axiosClient.get(`/api/admin/contact/messages?page=${page}&per_page=${perPage}`);
    
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Marquer comme lu/non-lu
  toggleRead: (id: number) => 
    axiosClient.patch(`/api/admin/contact/messages/${id}/toggle-read`),
  
  // Supprimer un message
  deleteMessage: (id: number) => 
    axiosClient.delete(`/api/admin/contact/messages/${id}`),
};

export const getAxes = axesApi.getAxes;
export const getAxe = axesApi.getById;
export const getMembresAxe = axesApi.getMembres;
export const updateMemberProfile = membresApi.update;
export const getMembre = membresApi.getById;

// ===== GESTION DES PUBLICATIONS =====
export const publicationsApi = {
  getAll: async (): Promise<ApiResponse<Publication[]>> => {
    try {
      const { data } = await axiosClient.get('/api/publications');
      return {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
        message: 'Publications récupérées avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<Publication[]>;
    }
  },

  getByMembre: async (membreId: number): Promise<ApiResponse<Publication[]>> => {
    try {
      const { data } = await axiosClient.get(`/api/membres/${membreId}/publications`);
      return {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
        message: 'Publications du membre récupérées avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<Publication[]>;
    }
  }
};

// ===== GESTION DES PRIX ET DISTINCTIONS =====
export const prixDistinctionsApi = {
  getAll: async (): Promise<ApiResponse<PrixDistinction[]>> => {
    try {
      const { data } = await axiosClient.get('/api/prix-distinctions');
      return {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
        message: 'Prix et distinctions récupérés avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<PrixDistinction[]>;
    }
  },

  getByMembre: async (membreId: number): Promise<ApiResponse<PrixDistinction[]>> => {
    try {
      const { data } = await axiosClient.get(`/api/membres/${membreId}/prix-distinctions`);
      return {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
        message: 'Prix et distinctions du membre récupérés avec succès'
      };
    } catch (error) {
      return handleApiError(error) as ApiResponse<PrixDistinction[]>;
    }
  }
}; 

