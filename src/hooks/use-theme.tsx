'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '@/types';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  const applyTheme = (mode: ThemeMode) => {
    let active: 'light' | 'dark' = 'dark';
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      active = prefersDark ? 'dark' : 'light';
    } else {
      active = mode;
    }

    setResolvedTheme(active);
    const root = document.documentElement;
    if (active === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('friend_theme') as ThemeMode;
    const initial = saved && ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
    setThemeState(initial);
    applyTheme(initial);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const current = localStorage.getItem('friend_theme') as ThemeMode || 'system';
      if (current === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('friend_theme', mode);
    applyTheme(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
