import api from './api';

export const bracketService = {
  getBracket: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/bracket`);
    return response.data;
  },

  generateBracket: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/bracket/generate`);
    return response.data;
  },

  cancelBracket: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}/bracket`);
    return response.data;
  },
};

export default bracketService;
