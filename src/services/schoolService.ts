import api from './api';

export const schoolService = {
  getSchools: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/schools`);
    return response.data;
  },

  registerSchool: async (eventId: string, data: any) => {
    const response = await api.post(`/events/${eventId}/schools`, data);
    return response.data;
  },

  updateSchool: async (eventId: string, schoolId: string, data: any) => {
    const response = await api.patch(`/events/${eventId}/schools/${schoolId}`, data);
    return response.data;
  },

  deleteSchool: async (eventId: string, schoolId: string) => {
    const response = await api.delete(`/events/${eventId}/schools/${schoolId}`);
    return response.data;
  },
};

export default schoolService;
