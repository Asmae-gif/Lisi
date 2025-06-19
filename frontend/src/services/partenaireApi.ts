import axios from '../lib/axios';

export const partenaireApi = {
    getAll: () => axios.get('/api/partenaires'),
    getOne: (id: number) => axios.get(`/api/partenaires/${id}`),
};

export default partenaireApi;