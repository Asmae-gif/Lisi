import axiosClient from './axiosClient';
import { Membre } from '../types/membre';

const DEFAULT_MEMBRES: Membre[] = [];

export const membreApi = {
  getAllMembres: async (): Promise<Membre[]> => {
    try {
      const { data } = await axiosClient.get('/api/membres');
      return Array.isArray(data) ? data : DEFAULT_MEMBRES;
    } catch (error) {
      console.warn('Erreur lors de la récupération des membres:', error);
      return DEFAULT_MEMBRES;
    }
  },

  getMembre: async (id: number): Promise<Membre | null> => {
    try {
      const { data } = await axiosClient.get(`/api/membres/${id}`);
      return data;
    } catch (error) {
      console.warn('Erreur lors de la récupération du membre:', error);
      return null;
    }
  },

  updateMembre: async (id: number, membre: Partial<Membre>): Promise<Membre> => {
    const { data } = await axiosClient.put(`/api/membres/${id}`, membre);
    return data;
  },

  deleteMembre: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/membres/${id}`);
  },

  createMembre: async (membre: Partial<Membre>): Promise<Membre> => {
    const { data } = await axiosClient.post('/api/membres', membre);
    return data;
  }
}; 