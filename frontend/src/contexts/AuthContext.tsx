import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import apiClient from '../api/axiosInstance'; 

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsAuthenticated: (status: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

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
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setIsAuthenticated, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};