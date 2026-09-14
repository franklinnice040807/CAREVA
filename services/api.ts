import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  User,
  StudentProfile,
  Skill,
  StudentSkill,
  Certificate,
  Project,
  SkillSubmission,
  DashboardStats,
  CompetencyLevel,
} from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('careva_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('careva_token');
      localStorage.removeItem('careva_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    role: 'STUDENT' | 'EMPLOYER';
    fullName?: string;
    companyName?: string;
  }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data;
  },

  me: async () => {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('careva_token');
      localStorage.removeItem('careva_user');
    }
  },
};

export const studentApi = {
  getProfile: async () => {
    const res = await api.get<ApiResponse<StudentProfile>>('/students/profile');
    return res.data;
  },

  updateProfile: async (data: Partial<StudentProfile>) => {
    const res = await api.put<ApiResponse<StudentProfile>>('/students/profile', data);
    return res.data;
  },

  getDashboard: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>('/students/dashboard');
    return res.data;
  },

  getSkillsCatalog: async (trade?: string) => {
    const res = await api.get<ApiResponse<Skill[]>>('/students/skills/catalog', {
      params: trade ? { trade } : {},
    });
    return res.data;
  },

  addSkill: async (data: {
    skillId: string;
    selfAssessedLevel?: CompetencyLevel;
    experienceNotes?: string;
  }) => {
    const res = await api.post<ApiResponse<StudentSkill>>('/students/skills', data);
    return res.data;
  },

  removeSkill: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/students/skills/${id}`);
    return res.data;
  },

  addCertificate: async (data: {
    title: string;
    issuer?: string;
    issueDate?: string;
    fileUrl?: string;
  }) => {
    const res = await api.post<ApiResponse<Certificate>>('/students/certificates', data);
    return res.data;
  },

  deleteCertificate: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/students/certificates/${id}`);
    return res.data;
  },

  addProject: async (data: {
    title: string;
    description?: string;
    skillsUsed?: string[];
    url?: string;
  }) => {
    const res = await api.post<ApiResponse<Project>>('/students/projects', data);
    return res.data;
  },

  deleteProject: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/students/projects/${id}`);
    return res.data;
  },

  getSubmissions: async () => {
    const res = await api.get<ApiResponse<SkillSubmission[]>>('/students/submissions');
    return res.data;
  },

  createSubmission: async (formData: FormData) => {
    const res = await api.post<ApiResponse<SkillSubmission>>('/students/submissions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getPassport: async () => {
    const res = await api.get<ApiResponse<StudentProfile>>('/students/passport');
    return res.data;
  },
};



export const evaluationApi = {
  run: async (submissionId: string) => {
    const res = await api.post<ApiResponse<{
      evaluation: any;
      overallScore: number;
      level: string;
      rubricScores: Record<string, number>;
      strengths: string[];
      improvements: string[];
      recommendations: string[];
      isDemo: boolean;
      providerName: string;
      verified: boolean;
      credentialId: string | null;
      skillName: string;
      submissionTitle: string;
      rubric: Array<{ key: string; label: string; description: string; weight: number }>;
    }>>('/evaluations/run', { submissionId });
    return res.data;
  },

  getSubmission: async (submissionId: string) => {
    const res = await api.get<ApiResponse<any>>(`/evaluations/submission/${submissionId}`);
    return res.data;
  },

  getRubric: async () => {
    const res = await api.get<ApiResponse<any>>('/evaluations/rubric');
    return res.data;
  },
};

export const publicApi = {
  verify: async (credentialId: string) => {
    const res = await api.get<ApiResponse<{
      credentialId: string;
      issuedAt: string;
      status: string;
      studentName: string;
      trade?: string;
      institute?: string;
      carevaId: string;
      skill: { name: string; category: string; trade: string };
      competencyLevel?: string;
      competencyScore?: number;
      verificationDate?: string;
      isVerified: boolean;
    }>>(`/public/verify/${credentialId}`);
    return res.data;
  },
};



export const employerApi = {
  getProfile: async () => {
    const res = await api.get<ApiResponse<any>>('/employers/profile');
    return res.data;
  },
  updateProfile: async (data: Record<string, unknown>) => {
    const res = await api.put<ApiResponse<any>>('/employers/profile', data);
    return res.data;
  },
  getDashboard: async () => {
    const res = await api.get<ApiResponse<any>>('/employers/dashboard');
    return res.data;
  },
  getJobs: async () => {
    const res = await api.get<ApiResponse<any[]>>('/employers/jobs');
    return res.data;
  },
  getJob: async (id: string) => {
    const res = await api.get<ApiResponse<any>>(`/employers/jobs/${id}`);
    return res.data;
  },
  createJob: async (data: Record<string, unknown>) => {
    const res = await api.post<ApiResponse<any>>('/employers/jobs', data);
    return res.data;
  },
  updateJob: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put<ApiResponse<any>>(`/employers/jobs/${id}`, data);
    return res.data;
  },
  searchCandidates: async (params?: Record<string, string | number | undefined>) => {
    const res = await api.get<ApiResponse<any[]>>('/employers/candidates', { params });
    return res.data;
  },
  getCandidate: async (studentId: string) => {
    const res = await api.get<ApiResponse<any>>(`/employers/candidates/${studentId}`);
    return res.data;
  },
  getApplications: async (jobId?: string) => {
    const res = await api.get<ApiResponse<any[]>>('/employers/applications', {
      params: jobId ? { jobId } : {},
    });
    return res.data;
  },
  updateApplication: async (id: string, status: string, notes?: string) => {
    const res = await api.put<ApiResponse<any>>(`/employers/applications/${id}`, { status, notes });
    return res.data;
  },
  shortlist: async (studentId: string, jobId?: string, notes?: string) => {
    const res = await api.post<ApiResponse<any>>('/employers/shortlist', { studentId, jobId, notes });
    return res.data;
  },
  getShortlist: async () => {
    const res = await api.get<ApiResponse<any[]>>('/employers/shortlist');
    return res.data;
  },
  getSkillsCatalog: async (trade?: string) => {
    const res = await api.get<ApiResponse<any[]>>('/employers/skills/catalog', {
      params: trade ? { trade } : {},
    });
    return res.data;
  },
};



export const matchingApi = {
  getJobMatches: async () => {
    const res = await api.get<ApiResponse<any[]>>('/matching/jobs');
    return res.data;
  },
  apply: async (jobId: string, coverNote?: string) => {
    const res = await api.post<ApiResponse<any>>('/matching/apply', { jobId, coverNote });
    return res.data;
  },
  getApplications: async () => {
    const res = await api.get<ApiResponse<any[]>>('/matching/applications');
    return res.data;
  },
  getInsights: async () => {
    const res = await api.get<ApiResponse<any>>('/matching/insights');
    return res.data;
  },
  runJobMatching: async (jobId: string) => {
    const res = await api.post<ApiResponse<any[]>>(`/matching/job/${jobId}/run`);
    return res.data;
  },
  getMatchDetail: async (jobId: string, studentId: string) => {
    const res = await api.get<ApiResponse<any>>(`/matching/detail/${jobId}/${studentId}`);
    return res.data;
  },
};



export const notificationApi = {
  list: async (unreadOnly = false) => {
    const res = await api.get<ApiResponse<{ notifications: any[]; unreadCount: number }>>(
      '/notifications',
      { params: unreadOnly ? { unread: 'true' } : {} }
    );
    return res.data;
  },
  markRead: async (id: string) => {
    const res = await api.put<ApiResponse>(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await api.put<ApiResponse>('/notifications/read-all');
    return res.data;
  },
};

export const feedbackApi = {
  submit: async (data: Record<string, unknown>) => {
    const res = await api.post<ApiResponse<any>>('/feedback', data);
    return res.data;
  },
  list: async () => {
    const res = await api.get<ApiResponse<any[]>>('/feedback');
    return res.data;
  },
  pending: async () => {
    const res = await api.get<ApiResponse<any[]>>('/feedback/pending');
    return res.data;
  },
};

export const adminApi = {
  getStats: async () => {
    const res = await api.get<ApiResponse<any>>('/admin/stats');
    return res.data;
  },
  getAnalytics: async () => {
    const res = await api.get<ApiResponse<any>>('/admin/analytics');
    return res.data;
  },
  getUsers: async (role?: string) => {
    const res = await api.get<ApiResponse<any[]>>('/admin/users', {
      params: role ? { role } : {},
    });
    return res.data;
  },
  getSubmissions: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/submissions');
    return res.data;
  },
  getJobs: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/jobs');
    return res.data;
  },
  getSkills: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/skills');
    return res.data;
  },
  toggleSkill: async (id: string, isActive: boolean) => {
    const res = await api.put<ApiResponse<any>>(`/admin/skills/${id}`, { isActive });
    return res.data;
  },
};

export default api;
