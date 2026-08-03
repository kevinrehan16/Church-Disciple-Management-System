import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  },
});

// REQUEST INTERCEPTOR: Kukunin ang token sa localStorage at ikakabit sa Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Kapag 401 (expired/invalid token), i-clear ang session at i-redirect sa login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Linisin ang buong session data sa localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user'); // I-clear din ang user info kung meron man

      // Iwasan ang redirection loop kung nasa login page na
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;