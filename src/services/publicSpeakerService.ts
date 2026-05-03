import api from './api';

export const publicSpeakerService = {
  getSpeakers: async (schoolId: string) => {
    const response = await api.get(`/schools/${schoolId}/public-speakers`);
    return response.data;
  },

  registerSpeaker: async (schoolId: string, data: any) => {
    const response = await api.post(`/schools/${schoolId}/public-speakers`, data);
    return response.data;
  },

  deleteSpeaker: async (schoolId: string, speakerId: string) => {
    const response = await api.delete(`/schools/${schoolId}/public-speakers/${speakerId}`);
    return response.data;
  },
};

export default publicSpeakerService;

