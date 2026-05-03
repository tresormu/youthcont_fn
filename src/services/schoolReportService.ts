import api from './api';

const schoolReportService = {
  generateAccess: async (data: { school_id: string; email: string; event_id: string }) => {
    const res = await api.post('/admin/school-access/generate', data);
    return res.data;
  },

  revokeAccess: async (accessCode: string) => {
    const res = await api.delete(`/admin/school-access/${accessCode}`);
    return res.data;
  },

  login: async (email: string, access_code: string) => {
    const res = await api.post('/school-report/login', { email, access_code });
    return res.data;
  },

  getDashboard: async () => {
    const res = await api.get('/school-report/dashboard');
    return res.data;
  },

  exportPDF: async () => {
    const res = await api.get('/school-report/export/pdf', { responseType: 'blob' });
    return res.data;
  },

  logout: async () => {
    // Clear cookie by calling a logout or just remove locally
    // The cookie will expire naturally; we just clear client state
  },
};

export default schoolReportService;

