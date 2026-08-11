import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import apiClient from '../api/axiosInstance'; 

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  login: (credentials: Record<string, any>) => Promise<any>; // 👈 Binago mula Promise<void> patungong Promise<any>
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // User info is kept ONLY in React memory state (not in localStorage)
  const [user, setUser] = useState<any | null>(null);
  
  // Set initial authentication status based on token presence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('auth_token');
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Fetch User Info upon refresh
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
      const response = await apiClient.get('/user'); 
      
      const userData = response.data.data || response.data;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Fetch user error:", error);
      
      // CRITICAL FIX: Burahin LANG ang token kapag 401 Unauthenticated ang nire-return!
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Login Function
  const login = async (credentials: Record<string, any>) => {
    const response = await apiClient.post('/login', credentials);

    const token = response.data.token || response.data.access_token;
    const userData = response.data.data || response.data.user;

    // TOKEN LANG ANG ISASAVE SA LOCALSTORAGE
    localStorage.setItem('auth_token', token);

    // USER DATA IS SAVED ONLY IN REACT MEMORY
    setUser(userData);
    setIsAuthenticated(true);

    return response.data;
  };

  // 3. Logout Function
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout'); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
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