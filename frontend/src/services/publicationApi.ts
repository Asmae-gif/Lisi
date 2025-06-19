import axios from '../lib/axios';

export const publicationApi = {
    getAll: () => axios.get('/api/publications'),
    getOne: (id: number) => axios.get(`/api/publications/${id}`),
};

export default publicationApi;