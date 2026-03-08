import api from './api';
import { Analytics } from '@/types';

export const analyticsService = {
  async getAnalytics(): Promise<Analytics> {
    const { data } = await api.get<Analytics>('/analytics');
    return data;
  },
};
