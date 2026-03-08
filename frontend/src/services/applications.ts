import api from './api';
import { JobApplication, PagedResult } from '@/types';

export const applicationsService = {
  async getApplications(params?: {
    jobId?: string;
    candidateId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<JobApplication>> {
    const { data } = await api.get<PagedResult<JobApplication>>('/applications', { params });
    return data;
  },
  async apply(jobId: string, coverLetter?: string): Promise<JobApplication> {
    const { data } = await api.post<JobApplication>('/applications', { jobId, coverLetter });
    return data;
  },
  async updateStatus(id: string, status: string): Promise<JobApplication> {
    const { data } = await api.patch<JobApplication>(`/applications/${id}/status`, { status });
    return data;
  },
};
