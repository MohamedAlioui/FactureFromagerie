import { api } from './authService';
import { User } from '../types/user';

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data.user;
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.user;
  },

  resetUserPassword: async (id: string, newPassword: string): Promise<void> => {
    await api.put(`/users/${id}/reset-password`, { newPassword });
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};