import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export const setupInterceptors = (
  setLoading: (progress: number) => void, 
  enqueueSnackbar: (msg: string, opts: unknown) => void,
  onUnauthorized?: () => void
) => {
  // Store interceptor IDs to eject them later if needed, but for now we just add them.
  // Note: This might add duplicate interceptors if called multiple times.
  // Ideally this should be called once or managed with a ref to check if initialized.
  
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      setLoading(30);
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
      
      if (message === 'Could not validate credentials' || error.response?.status === 401) {
        if (onUnauthorized) {
          onUnauthorized();
        }
      }
      if (Array.isArray(message)) {
        message.forEach((msg) => {
          enqueueSnackbar(msg.msg, { variant: 'error' });
        });
        return Promise.reject(error);
      }
      enqueueSnackbar(message, { variant: 'error' });
      return Promise.reject(error);
    }
  );
};

export default api;
