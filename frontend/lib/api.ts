import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Avoid redirect loops while already on the login page
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Auth API error:', error);
      // Re-throw with more context
      if (error.response) {
        // Server responded with error
        throw error;
      } else if (error.request) {
        // Request made but no response
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred during login.');
      }
    }
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },
};

// User API
export const userApi = {
  me: () => api.get('/me'),
};

// Organizations API
export const orgsApi = {
  list: () => api.get('/orgs'),
  get: (orgId: string) => api.get(`/orgs/${orgId}`),
  create: (data: { name: string; slug: string; description?: string }) =>
    api.post('/orgs', data),
  update: (orgId: string, data: any) => api.put(`/orgs/${orgId}`, data),
  invite: (orgId: string, data: { email: string; role_id?: number }) =>
    api.post(`/orgs/${orgId}/invites`, data),
};

// Seasons API
export const seasonsApi = {
  list: (orgId: string) => api.get(`/orgs/${orgId}/seasons`),
  get: (orgId: string, seasonId: string) =>
    api.get(`/orgs/${orgId}/seasons/${seasonId}`),
  create: (orgId: string, data: any) =>
    api.post(`/orgs/${orgId}/seasons`, data),
};

// Teams API
export const teamsApi = {
  list: (orgId: string) => api.get(`/orgs/${orgId}/teams`),
  create: (orgId: string, data: any) => api.post(`/orgs/${orgId}/teams`, data),
  get: (orgId: string, teamId: string) =>
    api.get(`/orgs/${orgId}/teams/${teamId}`),
};

// Player Profiles API
export const playerProfilesApi = {
  list: (orgId: string) => api.get(`/orgs/${orgId}/player-profiles`),
  create: (orgId: string, data: any) =>
    api.post(`/orgs/${orgId}/player-profiles`, data),
};

// Roster API
export const rosterApi = {
  list: (orgId: string, teamId: string) =>
    api.get(`/orgs/${orgId}/teams/${teamId}/roster`),
  add: (orgId: string, teamId: string, data: any) =>
    api.post(`/orgs/${orgId}/teams/${teamId}/roster`, data),
  remove: (orgId: string, teamId: string, rosterId: string) =>
    api.delete(`/orgs/${orgId}/teams/${teamId}/roster/${rosterId}`),
};

// Matches API
export const matchesApi = {
  list: (orgId: string) => api.get(`/orgs/${orgId}/matches`),
  get: (orgId: string, matchId: string) =>
    api.get(`/orgs/${orgId}/matches/${matchId}`),
  create: (orgId: string, data: any) => api.post(`/orgs/${orgId}/matches`, data),
  submitResult: (orgId: string, matchId: string, data: any) =>
    api.post(`/orgs/${orgId}/matches/${matchId}/submit-result`, data),
  confirmResult: (orgId: string, matchId: string, data: any) =>
    api.post(`/orgs/${orgId}/matches/${matchId}/confirm-result`, data),
};

// Standings API
export const standingsApi = {
  get: (orgId: string, seasonId: string) =>
    api.get(`/orgs/${orgId}/seasons/${seasonId}/standings`),
  recompute: (orgId: string, seasonId: string) =>
    api.post(`/orgs/${orgId}/seasons/${seasonId}/recompute-standings`),
};

// Announcements API
export const announcementsApi = {
  list: (orgId: string) => api.get(`/orgs/${orgId}/announcements`),
  create: (orgId: string, data: any) =>
    api.post(`/orgs/${orgId}/announcements`, data),
};

// Notifications API
export const notificationsApi = {
  list: () => api.get('/me/notifications'),
  markRead: (id: number) => api.post(`/me/notifications/${id}/read`),
  markAllRead: () => api.post('/me/notifications/read-all'),
};

