import axios from '../lib/axios';

export const prixDistinctionApi = {
    getAll: () => axios.get('/api/prix-distinctions'),
    getOne: (id: number) => axios.get(`/api/prix-distinctions/${id}`),
};

export default prixDistinctionApi;