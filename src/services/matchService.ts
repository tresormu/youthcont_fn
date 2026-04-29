import api from './api';

export const matchService = {
  getMatchups: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/matchups`);
    return response.data;
  },

  createMatchup: async (eventId: string, data: any) => {
    const response = await api.post(`/events/${eventId}/matchups`, data);
    return response.data;
  },

  autoAssign: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/matchups/auto`);
    return response.data;
  },

  cancelPrelims: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}/matchups/preliminary`);
    return response.data;
  },

  getMatches: async (matchupId: string) => {
    const response = await api.get(`/matchups/${matchupId}/matches`);
    return response.data;
  },

  createMatches: async (matchupId: string) => {
    const response = await api.post(`/matchups/${matchupId}/matches`);
    return response.data;
  },

  cancelMatchup: async (matchupId: string) => {
    const response = await api.delete(`/matchups/${matchupId}`);
    return response.data;
  },

  enterResult: async (matchId: string, result: any) => {
    const response = await api.patch(`/matches/${matchId}/result`, result);
    return response.data;
  },

  updatePairing: async (matchId: string, data: { teamAId: string; teamBId: string }) => {
    const response = await api.patch(`/matches/${matchId}/pairing`, data);
    return response.data;
  },

  voidResult: async (matchId: string) => {
    const response = await api.patch(`/matches/${matchId}/void`);
    return response.data;
  },

  generateBracket: async (eventId: string, teamIds?: string[]) => {
    const response = await api.post(`/events/${eventId}/bracket/generate`, teamIds ? { teamIds } : {});
    return response.data;
  },
};

export default matchService;
