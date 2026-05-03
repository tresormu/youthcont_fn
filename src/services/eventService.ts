import api from './api';

export const eventService = {
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getEvent: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: any) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: any) => {
    const response = await api.patch(`/events/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/events/${id}/status`, { status });
    return response.data;
  },

  rollbackStatus: async (id: string) => {
    const response = await api.patch(`/events/${id}/status/rollback`);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;

