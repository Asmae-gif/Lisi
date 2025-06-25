import axiosClient from '@/services/axiosClient';

export const partenaireApi = {
    getAll: () => axiosClient.get('/api/partenaires'),
    getOne: (id: number) => axiosClient.get(`/api/partenaires/${id}`),
};

export default partenaireApi;