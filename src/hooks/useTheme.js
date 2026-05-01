import { useState, useEffect } from 'react';
import { THEME_KEY, getInitialTheme } from '@/constants/theme';

/**
 * hooks/useTheme.js
 *
 * Custom hook that manages the app-wide light/dark theme.
 * Persists to localStorage and syncs with the <html data-theme> attribute.
 *
 * Usage:
 *   const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
