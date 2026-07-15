import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SalusTheme {
  sidebarBg: string;
  menuTextColor: string;
  activeParentBg: string;
  activeSubmenuTextColor: string;
  topbarBg: string;
  topbarTextColor: string;
}

const defaultTheme: SalusTheme = {
  sidebarBg: '#1e293b',
  menuTextColor: '#f8fafc',
  activeParentBg: '#0284c7',
  activeSubmenuTextColor: '#ffffff',
  topbarBg: '#ffffff',
  topbarTextColor: '#0f172a',
};

const ThemeContext = createContext<{ 
  theme: SalusTheme; 
  setTheme: React.Dispatch<React.SetStateAction<SalusTheme>> 
} | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<SalusTheme>(() => {
    const saved = localStorage.getItem('salus-theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('salus-theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};