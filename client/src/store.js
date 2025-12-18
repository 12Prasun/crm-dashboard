import { create } from 'zustand';
import { authAPI, companyAPI, contactAPI, dealAPI } from './api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  register: async (email, password, companyName) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register({ email, password, company_name: companyName });
      localStorage.setItem('token', response.data.token);
      set({ token: response.data.token, user: response.data.user, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.token);
      set({ token: response.data.token, user: response.data.user, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  getMe: async () => {
    try {
      const response = await authAPI.getMe();
      set({ user: response.data });
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, user: null });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

export const useCompanyStore = create((set) => ({
  companies: [],
  currentCompany: null,
  total: 0,
  page: 1,
  loading: false,
  error: null,

  fetchCompanies: async (page = 1, search = '') => {
    set({ loading: true, error: null });
    try {
      const response = await companyAPI.list(page, 20, search);
      set({
        companies: response.data.data,
        total: response.data.total,
        page: response.data.page,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch companies', loading: false });
    }
  },

  getCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await companyAPI.get(id);
      set({ currentCompany: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch company', loading: false });
    }
  },

  createCompany: async (data) => {
    try {
      const response = await companyAPI.create(data);
      set((state) => ({ companies: [response.data, ...state.companies] }));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create company';
    }
  },

  updateCompany: async (id, data) => {
    try {
      const response = await companyAPI.update(id, data);
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? response.data : c)),
        currentCompany: state.currentCompany?.id === id ? response.data : state.currentCompany,
      }));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update company';
    }
  },

  deleteCompany: async (id) => {
    try {
      await companyAPI.delete(id);
      set((state) => ({ companies: state.companies.filter((c) => c.id !== id) }));
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete company';
    }
  },
}));

export const useContactStore = create((set) => ({
  contacts: [],
  currentContact: null,
  total: 0,
  page: 1,
  loading: false,
  error: null,

  fetchContacts: async (page = 1, search = '') => {
    set({ loading: true, error: null });
    try {
      const response = await contactAPI.list(page, 20, search);
      set({
        contacts: response.data.data,
        total: response.data.total,
        page: response.data.page,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch contacts', loading: false });
    }
  },

  getContactsByCompany: async (companyId, page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await contactAPI.getByCompany(companyId, page);
      set({
        contacts: response.data.data,
        total: response.data.total,
        page: response.data.page,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch contacts', loading: false });
    }
  },

  getContact: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await contactAPI.get(id);
      set({ currentContact: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch contact', loading: false });
    }
  },

  createContact: async (data) => {
    try {
      const response = await contactAPI.create(data);
      set((state) => ({ contacts: [response.data, ...state.contacts] }));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create contact';
    }
  },

  updateContact: async (id, data) => {
    try {
      const response = await contactAPI.update(id, data);
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? response.data : c)),
        currentContact: state.currentContact?.id === id ? response.data : state.currentContact,
      }));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update contact';
    }
  },

  deleteContact: async (id) => {
    try {
      await contactAPI.delete(id);
      set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) }));
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete contact';
    }
  },
}));

export const useDealStore = create((set) => ({
  deals: [],
  currentDeal: null,
  total: 0,
  page: 1,
  loading: false,
  error: null,

  fetchDeals: async (page = 1, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await dealAPI.list(page, 20, filters);
      set({
        deals: response.data.data,
        total: response.data.total,
        page: response.data.page,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch deals', loading: false });
    }
  },

  getDealsByCompany: async (companyId, page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await dealAPI.getByCompany(companyId, page);
      set({
        deals: response.data.data,
        total: response.data.total,
        page: response.data.page,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch deals', loading: false });
    }
  },

  getDeal: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await dealAPI.get(id);
      set({ currentDeal: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch deal', loading: false });
    }
  },

  createDeal: async (data) => {
    try {
      const response = await dealAPI.create(data);
      set((state) => ({ deals: [response.data, ...state.deals] }));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create deal';
    }
  },

  updateDeal: async (id, data) => {
    try {
      const response = await dealAPI.update(id, data);
      set((state) => ({
        deals: state.deals.map((d) => (d.id === id ? response.data : d)),
        currentDeal: state.currentDeal?.id === id ? response.data : state.currentDeal,
      }));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update deal';
    }
  },

  deleteDeal: async (id) => {
    try {
      await dealAPI.delete(id);
      set((state) => ({ deals: state.deals.filter((d) => d.id !== id) }));
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete deal';
    }
  },
}));
