import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import apiClient from '../api/axiosInstance'; 

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  login: (credentials: Record<string, any>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch User gamit ang Bearer Token
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Tatakbo ang interceptor para isabit ang Bearer token sa header
      const response = await apiClient.get('/user'); 
      setUser(response.data.user || response.data);
      setIsAuthenticated(true);
    } catch (error) {
      // Kapag invalid o expired ang token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Login function (Bearer Token approach)
  const login = async (credentials: Record<string, any>) => {
    // Walang nang CSRF cookie endpoint dito! Direct post na sa login.
    const response = await apiClient.post('/login', credentials);

    // Saluhin ang token at user galing sa backend response
    const { token, user } = response.data;

    // I-save ang token sa localStorage para magamit ng Axios interceptor
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    setIsAuthenticated(true);
  };

  // 3. Logout function
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout'); 
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Burahin ang token at user data sa storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname !== '/login') {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, fetchUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};