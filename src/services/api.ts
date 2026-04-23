import axios from 'axios';

const getApiBaseUrl = () => {
  // Priority 1: Vite env var
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl?.trim()) return envUrl.trim();

  // Priority 2: Production fallback
  if (import.meta.env.PROD) {
    return 'https://api.youthcontest.com/api/v1'; // Update with actual prod URL when known
  }

  // Priority 3: Local dev fallback
  return 'http://localhost:5000/api/v1';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  withCredentials: true, // Crucial for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      const isDashboard = window.location.pathname.startsWith('/dashboard');
      const isLoginPage = window.location.pathname.includes('/login');
      if (isDashboard && !isLoginPage) {
        window.location.href = '/login';
      }
    }

    if (!response) {
      error.message = 'Network error: could not reach the API server.';
    }

    return Promise.reject(error);
  }
);

export default api;

