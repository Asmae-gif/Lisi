import axios from '../lib/axios';

export const projectApi = {
    getAll: () => axios.get('/api/projects'),
    getOne: (id: number) => axios.get(`/api/projects/${id}`),
};
export function fetchProjects() {
    // ...
  }
  
export default projectApi;