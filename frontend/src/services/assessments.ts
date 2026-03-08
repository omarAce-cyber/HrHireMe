import api from './api';
import { Assessment, AssessmentResult } from '@/types';

export const assessmentsService = {
  async getAssessment(id: string): Promise<Assessment> {
    const { data } = await api.get<Assessment>(`/assessments/${id}`);
    return data;
  },
  async createAssessment(assessment: Omit<Assessment, 'id' | 'jobTitle' | 'questionCount' | 'createdAt'>): Promise<Assessment> {
    const { data } = await api.post<Assessment>('/assessments', assessment);
    return data;
  },
  async submitResult(
    assessmentId: string,
    answers: { questionId: string; answer: string }[],
    timeTakenSeconds: number,
    focusLostCount: number,
  ): Promise<AssessmentResult> {
    const { data } = await api.post<AssessmentResult>(`/assessments/${assessmentId}/submit`, {
      answers,
      timeTakenSeconds,
      focusLostCount,
    });
    return data;
  },
};
