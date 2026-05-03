import api from './api';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Cookie is cleared server-side; nothing to remove locally
    }
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Staff Auth
  staffLogin: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/staff/auth/login', credentials);
    return response.data;
  },

  activate: async (data: { email: string; pinCode: string; newPassword: string }) => {
    const response = await api.post('/staff/auth/activate', data);
    return response.data;
  },

  changePassword: async (data: { newPassword: string }) => {
    const response = await api.patch('/staff/auth/change-password', data);
    return response.data;
  }
};

export default authService;

