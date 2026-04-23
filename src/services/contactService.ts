import api from './api';

export const contactService = {
  submitContact: async (data: any) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getContacts: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  updateContactStatus: async (id: string, status: string) => {
    const response = await api.patch(`/contact/${id}/status`, { status });
    return response.data;
  },
};

export default contactService;
