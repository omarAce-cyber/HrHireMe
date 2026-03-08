import api from './api';
import { User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post<User>('/auth/login', { email, password });
    return data;
  },
  async register(firstName: string, lastName: string, email: string, password: string, role: string): Promise<User> {
    const { data } = await api.post<User>('/auth/register', { firstName, lastName, email, password, role });
    return data;
  },
};
