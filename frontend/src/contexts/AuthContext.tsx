import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import axios from 'axios';
import apiClient from '../api/axiosInstance'; 

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsAuthenticated: (status: boolean) => void;
  fetchUser: () => Promise<void>;
  login: (credentials: Record<string, any>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const getBaseDomain = () => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    return apiUrl.replace(/\/api\/v1\/?$/, '');
  };
  
  // 1. Fetch User (Laravel Sanctum standard endpoint: /user)
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/user');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: Record<string, any>) => {

    // A. I-diretso ang pagtawag sa sanctum/csrf-cookie gamit ang root domain
    await apiClient.get(`/sanctum/csrf-cookie`, {
      withCredentials: true
    });

    // B. Mag-send ng Login Request (gagamit na ito ng apiClient dahil may /api/v1 baseURL na)
    await apiClient.post('/login', credentials);

    // C. Kunin ang User details
    await fetchUser();
  };

  // 2. Logout (Laravel standard endpoint: /logout)
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout'); 
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Optional: I-redirect sa login page kung hindi pa automatic
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    // Huwag munang mag-fetch ng user kung nasa login page naman na
    if (window.location.pathname !== '/login') {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setIsAuthenticated, fetchUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};