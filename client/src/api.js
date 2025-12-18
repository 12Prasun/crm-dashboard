import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  getMe: () => api.get('/api/auth/me'),
};

// Company APIs
export const companyAPI = {
  list: (page = 1, limit = 20, search = '') => 
    api.get('/api/companies', { params: { page, limit, search } }),
  create: (data) => api.post('/api/companies', data),
  get: (id) => api.get(`/api/companies/${id}`),
  update: (id, data) => api.put(`/api/companies/${id}`, data),
  delete: (id) => api.delete(`/api/companies/${id}`),
};

// Contact APIs
export const contactAPI = {
  list: (page = 1, limit = 20, search = '') => 
    api.get('/api/contacts', { params: { page, limit, search } }),
  create: (data) => api.post('/api/contacts', data),
  get: (id) => api.get(`/api/contacts/${id}`),
  update: (id, data) => api.put(`/api/contacts/${id}`, data),
  delete: (id) => api.delete(`/api/contacts/${id}`),
  getByCompany: (companyId, page = 1, limit = 20) => 
    api.get(`/api/contacts/company/${companyId}`, { params: { page, limit } }),
};

// Deal APIs
export const dealAPI = {
  list: (page = 1, limit = 20, filters = {}) => 
    api.get('/api/deals', { params: { page, limit, ...filters } }),
  create: (data) => api.post('/api/deals', data),
  get: (id) => api.get(`/api/deals/${id}`),
  update: (id, data) => api.put(`/api/deals/${id}`, data),
  delete: (id) => api.delete(`/api/deals/${id}`),
  getByCompany: (companyId, page = 1, limit = 20) => 
    api.get(`/api/deals/company/${companyId}`, { params: { page, limit } }),
};

export default api;
