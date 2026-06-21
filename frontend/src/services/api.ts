import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach session ID to every request
api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('pf_session_id');
  if (sessionId) config.headers['x-session-id'] = sessionId;

  const adminToken = localStorage.getItem('pf_admin_token');
  if (adminToken) config.headers['Authorization'] = `Bearer ${adminToken}`;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pf_admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Chat API
export const chatAPI = {
  sendMessage: (message: string, sessionId: string) =>
    api.post('/chat/message', { message, sessionId }),
  getHistory: (sessionId: string) =>
    api.get(`/chat/history/${sessionId}`),
};

// Lead API
export const leadAPI = {
  create: (data: {
    sessionId: string;
    name: string;
    phone: string;
    email: string;
    investmentGoal: string;
    context?: string;
  }) => api.post('/leads', data),
  getAll: (params?: { priority?: string; status?: string; page?: number; search?: string }) =>
    api.get('/leads', { params }),
  update: (id: string, data: { status?: string; notes?: string }) =>
    api.patch(`/leads/${id}`, data),
};

// Admin API
export const adminAPI = {
  login: (email: string, password: string) =>
    api.post('/admin/login', { email, password }),
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: { page?: number }) => api.get('/admin/users', { params }),
  getTickets: (params?: { status?: string; priority?: string; page?: number }) =>
    api.get('/admin/advisor-tickets', { params }),
  updateTicket: (id: string, data: { status?: string; assignedAdvisor?: string; notes?: string }) =>
    api.patch(`/admin/advisor-tickets/${id}`, data),
};

export default api;
