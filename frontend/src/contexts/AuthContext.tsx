import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import apiClient from '../api/axiosInstance'; 

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  login: (credentials: Record<string, any>) => Promise<any>;
  logout: () => void;
  hasPermission: (permission: string) => boolean; // 👈 Idagdag ito
  hasRole: (role: string) => boolean;             // 👈 Idagdag ito
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('auth_token');
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: Record<string, any>) => {
    const response = await apiClient.post('/login', credentials);

    const token = response.data.token || response.data.access_token;
    const userData = response.data.data || response.data.user;

    localStorage.setItem('auth_token', token);

    setUser(userData);
    setIsAuthenticated(true);

    return response.data;
  };

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

  // --- 🛠️ MGA HELPER FUNCTIONS PARA SA SPATIE PERMISSIONS & ROLES ---
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    // Sinusuportahan nito kung ang permissions ay array ng strings o objects
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };
  // -----------------------------------------------------------------

  useEffect(() => {
    if (window.location.pathname !== '/login') {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, fetchUser, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};