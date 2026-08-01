import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  },
});

// === REQUEST INTERCEPTOR (DITO NATIN ILALAGAY ANG BEARER TOKEN) ===
// Ito ang mag-a-attach ng token sa bawat request na gagawin mo sa backend
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token'); // Kunin ang token mula sa localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// === RESPONSE INTERCEPTOR ===
// Panatilihin ito para ma-catch kung sakaling mag-expire o mapanis ang token (401 Unauthenticated)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 1. Burahin ang token at user data sa localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user'); 
            
            // 2. I-redirect ang user sa login page kung hindi pa siya doon
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;