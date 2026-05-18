import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; type: 'sparky' | 'client' }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// ─── USERS ────────────────────────────────────────────────────────────────
export const userAPI = {
  getSparkies: (params?: { search?: string; category?: string; minRating?: number }) =>
    api.get('/users/sparkies', { params }),
  getUserProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: Record<string, unknown>) => api.put('/users/profile', data),
  completeOnboarding: (data: Record<string, unknown>) => api.put('/users/onboarding', data),
  addSkill: (data: Record<string, unknown>) => api.post('/users/skills', data),
  updateSkill: (skillId: string, data: Record<string, unknown>) => api.put(`/users/skills/${skillId}`, data),
  deleteSkill: (skillId: string) => api.delete(`/users/skills/${skillId}`),
  addCredits: (amount: number) => api.post('/users/credits/add', { amount }),
  getSparkyDashboard: () => api.get('/users/dashboard/sparky'),
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────
export const projectAPI = {
  getProjects: (params?: { search?: string; status?: string; minBudget?: number; maxBudget?: number; sort?: string }) =>
    api.get('/projects', { params }),
  getProject: (id: string) => api.get(`/projects/${id}`),
  createProject: (data: Record<string, unknown>) => api.post('/projects', data),
  updateProject: (id: string, data: Record<string, unknown>) => api.put(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
  placeBid: (projectId: string, data: Record<string, unknown>) => api.post(`/projects/${projectId}/bids`, data),
  acceptBid: (projectId: string, bidId: string) => api.put(`/projects/${projectId}/bids/${bidId}/accept`),
  getMyProjects: () => api.get('/projects/my/client'),
};

// ─── SESSIONS ─────────────────────────────────────────────────────────────
export const sessionAPI = {
  bookSession: (data: Record<string, unknown>) => api.post('/sessions', data),
  getMySessions: (params?: { status?: string }) => api.get('/sessions', { params }),
  cancelSession: (id: string) => api.put(`/sessions/${id}/cancel`),
  completeSession: (id: string, data?: { rating?: number; comment?: string }) => api.put(`/sessions/${id}/complete`, data),
};

// ─── FUNDRAISE ────────────────────────────────────────────────────────────
export const fundraiseAPI = {
  getCampaigns: (params?: { search?: string; status?: string }) => api.get('/fundraise', { params }),
  getMyCampaigns: () => api.get('/fundraise/my'),
  getCampaign: (id: string) => api.get(`/fundraise/${id}`),
  createCampaign: (data: Record<string, unknown>) => api.post('/fundraise', data),
  donate: (id: string, amount: number) => api.post(`/fundraise/${id}/donate`, { amount }),
  deleteCampaign: (id: string) => api.delete(`/fundraise/${id}`),
};

// ─── RESOURCES ────────────────────────────────────────────────────────────
export const resourceAPI = {
  getResources: (params?: { type?: string; category?: string; search?: string }) =>
    api.get('/resources', { params }),
  getResource: (id: string) => api.get(`/resources/${id}`),
  saveResource: (id: string) => api.post(`/resources/${id}/save`),
};

// ─── MENTORS ──────────────────────────────────────────────────────────────
export const mentorAPI = {
  getMentors: (params?: { specialty?: string; search?: string }) => api.get('/mentors', { params }),
  requestConsultation: (id: string, message: string) => api.post(`/mentors/${id}/request`, { message }),
};

// ─── AI ───────────────────────────────────────────────────────────────────
export const aiAPI = {
  getSkillSuggestions: (data: { currentSkills?: string[]; interests?: string[]; goals?: string }) =>
    api.post('/ai/skill-suggestions', data),
  getProjectMatches: (data: { skills: unknown[]; projects: unknown[] }) =>
    api.post('/ai/project-match', data),
  generateBio: (data: { skills?: string; experience?: string; tone?: string }) =>
    api.post('/ai/generate-bio', data),
  getLearningPath: (data: { goal?: string; currentLevel?: string; timeAvailable?: string }) =>
    api.post('/ai/learning-path', data),
};

export default api;
