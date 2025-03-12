import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getDesignations = () => api.get('/designations');
export const getDepartments = (designation) => api.get(`/departments/${designation}`);
export const getEmploymentTypes = () => api.get('/employment-types');
export const createEmployee = (data) => api.post('/employees', data);

export default api;