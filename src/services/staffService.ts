import api from './api';

export const staffService = {
  getStaff: async () => {
    const response = await api.get('/staff');
    return response.data;
  },

  updateStaff: async (id: string, data: any) => {
    const response = await api.patch(`/staff/${id}`, data);
    return response.data;
  },

  deactivateStaff: async (id: string) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },
};

export default staffService;

