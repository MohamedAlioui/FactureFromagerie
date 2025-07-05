import { api } from './authService';
import { Client } from '../types/client';

export const clientService = {
  getAllClients: async (): Promise<Client[]> => {
    const response = await api.get('/clients');
    return response.data;
  },

  getClientById: async (id: string): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (clientData: Omit<Client, '_id' | 'createdAt'>): Promise<Client> => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  updateClient: async (id: string, clientData: Omit<Client, '_id' | 'createdAt'>): Promise<Client> => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};