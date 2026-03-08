import api from './api';
import { Job, PagedResult } from '@/types';

export const jobsService = {
  async getJobs(params?: { search?: string; status?: string; page?: number; pageSize?: number }): Promise<PagedResult<Job>> {
    const { data } = await api.get<PagedResult<Job>>('/jobs', { params });
    return data;
  },
  async getJob(id: string): Promise<Job> {
    const { data } = await api.get<Job>(`/jobs/${id}`);
    return data;
  },
  async createJob(job: Omit<Job, 'id' | 'postedByName' | 'createdAt' | 'applicationCount'>): Promise<Job> {
    const { data } = await api.post<Job>('/jobs', job);
    return data;
  },
  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    const { data } = await api.put<Job>(`/jobs/${id}`, job);
    return data;
  },
  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};
