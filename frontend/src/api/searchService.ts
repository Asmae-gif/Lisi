import axiosClient from '../services/axiosClient';

export const searchData = async (query: string) => {
  try {
    const response = await axiosClient.get('/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    throw error;
  }
};
