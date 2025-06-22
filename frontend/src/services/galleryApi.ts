import axiosClient from './axiosClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Gallery {
  id: number;
  title: string;
  title_fr?: string;
  title_en?: string;
  title_ar?: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  image_path: string;
  galleriesable_id: number;
  galleriesable_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGalleryData {
  title: string;
  title_fr?: string;
  title_en?: string;
  title_ar?: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  image_path: string;
  galleriesable_type: string;
  galleriesable_id: number;
}

export interface UpdateGalleryData extends CreateGalleryData {
  id: number;
}

export interface PaginatedGalleriesResponse {
  data: Gallery[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
  };
}

class GalleryApiService {
  // Endpoints publics
  async getGalleries(category: string, page: number = 1): Promise<PaginatedGalleriesResponse> {
    try {
      const response = await axiosClient.get('/api/galleries', {
        params: {
          category,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des galeries:', error);
      throw error;
    }
  }

  async getGalleryById(id: number): Promise<Gallery> {
    try {
      const response = await axiosClient.get(`/api/admin/galleries/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la galerie ${id}:`, error);
      throw error;
    }
  }

  // Endpoints admin (protégés)
  async getAllGalleries(): Promise<Gallery[]> {
    try {
      const response = await axiosClient.get('/api/admin/galleries');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des galeries:', error);
      throw error;
    }
  }

  async createGallery(data: CreateGalleryData): Promise<Gallery> {
    try {
      const response = await axiosClient.post('/api/admin/galleries', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la galerie:', error);
      throw error;
    }
  }

  async updateGallery(id: number, data: Partial<CreateGalleryData>): Promise<Gallery> {
    try {
      const response = await axiosClient.put(`/api/admin/galleries/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la galerie ${id}:`, error);
      throw error;
    }
  }

  async deleteGallery(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/admin/galleries/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la galerie ${id}:`, error);
      throw error;
    }
  }
}

export const galleryApiService = new GalleryApiService();