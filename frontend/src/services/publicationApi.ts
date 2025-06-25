import axiosClient from '@/services/axiosClient';

export const publicationApi = {
    getAll: () => axiosClient.get('/api/publications'),
    getOne: (id: number) => axiosClient.get(`/api/publications/${id}`),
};

export default publicationApi;