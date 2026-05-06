import axios from 'axios';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  if (import.meta.env.PROD) {
    return 'https://youthcont.andasy.dev/api/v1';
  }

  return 'http://localhost:5000/api/v1';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Network error: could not reach the API server.';
    }
    return Promise.reject(error);
  }
);

export default api;
