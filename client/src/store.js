import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));

export const useCompanyStore = create((set) => ({
  companies: [],
  selectedCompany: null,

  setCompanies: (companies) => set({ companies }),

  selectCompany: (company) => set({ selectedCompany: company }),

  addCompany: (company) => {
    set((state) => ({
      companies: [...state.companies, company],
    }));
  },

  updateCompany: (id, updatedData) => {
    set((state) => ({
      companies: state.companies.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
    }));
  },

  deleteCompany: (id) => {
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
    }));
  },
}));

export const useContactStore = create((set) => ({
  contacts: [],
  filteredContacts: [],

  setContacts: (contacts) => set({ contacts, filteredContacts: contacts }),

  addContact: (contact) => {
    set((state) => ({
      contacts: [...state.contacts, contact],
      filteredContacts: [...state.filteredContacts, contact],
    }));
  },

  updateContact: (id, updatedData) => {
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
    }));
  },

  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      filteredContacts: state.filteredContacts.filter((c) => c.id !== id),
    }));
  },

  filterContacts: (query) => {
    set((state) => ({
      filteredContacts: state.contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      ),
    }));
  },
}));
