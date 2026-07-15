import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Napaka-importante: Pinapayagan ang cookies
  withXSRFToken: true,   // Automatic na nilalagay ang XSRF header
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  },
});

// === RESPONSE INTERCEPTOR ===
// Dito lang natin kailangan i-check ang 401 (Unauthenticated)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kung ang server ay nagsabi ng 401 (Unauthorized/Expired Session)
    if (error.response?.status === 401) {
      // 1. Burahin ang local state kung meron (optional)
      // localStorage.removeItem('user'); 
      
      // 2. I-redirect ang user sa login page
      // Siguraduhin na hindi ito mag-re-redirect kung nasa login page na
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;