export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'HR' | 'Candidate';
  token: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  salaryRange?: string;
  status: 'Draft' | 'Open' | 'Closed';
  deadline?: string;
  postedByName: string;
  createdAt: string;
  applicationCount: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  status: 'Pending' | 'Reviewing' | 'Accepted' | 'Rejected';
  coverLetter?: string;
  readinessScore?: number;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  points: number;
  correctAnswer?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  timeLimitMinutes: number;
  isRandomized: boolean;
  jobId: string;
  jobTitle: string;
  questionCount: number;
  createdAt: string;
  questions: Question[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  candidateId: string;
  candidateName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTakenSeconds: number;
  completedWithCheatingFlag: boolean;
  focusLostCount: number;
  createdAt: string;
}

export interface Analytics {
  totalJobs: number;
  totalApplications: number;
  totalCandidates: number;
  totalAssessments: number;
  averageScore: number;
  applicationsPerJob: { jobTitle: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
