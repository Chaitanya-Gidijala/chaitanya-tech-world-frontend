import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * hooks/useTheme.js
 *
 * Reads the app-wide theme from <ThemeProvider>.
 *
 * Usage:
 *   const { theme, toggleTheme, setTheme } = useTheme();
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return ctx;
}
