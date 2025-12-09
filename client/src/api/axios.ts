import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export const setupInterceptors = (setLoading: (progress: number) => void, enqueueSnackbar: (msg: string, opts: unknown) => void) => {
  api.interceptors.request.use(
    (config) => {
      setLoading(30);
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      setLoading(100);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      setLoading(100);
      return response;
    },
    (error) => {
      setLoading(100);
      const message = error.response?.data?.detail || 'An error occurred';
      enqueueSnackbar(message, { variant: 'error' });
      return Promise.reject(error);
    }
  );
};

export default api;
