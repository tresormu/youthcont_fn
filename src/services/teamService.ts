import api from './api';

export const teamService = {
  getTeams: async (schoolId: string) => {
    const response = await api.get(`/schools/${schoolId}/teams`);
    return response.data;
  },

  registerTeam: async (schoolId: string, data: any) => {
    const response = await api.post(`/schools/${schoolId}/teams`, data);
    return response.data;
  },

  updateTeam: async (schoolId: string, teamId: string, data: any) => {
    const response = await api.patch(`/schools/${schoolId}/teams/${teamId}`, data);
    return response.data;
  },

  deleteTeam: async (schoolId: string, teamId: string) => {
    const response = await api.delete(`/schools/${schoolId}/teams/${teamId}`);
    return response.data;
  },

  getRankings: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/rankings`);
    return response.data;
  },

  exportRankings: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/rankings/excel`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportRankingsPDF: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/rankings/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default teamService;

