import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { THEME_KEY, getInitialTheme } from '@/constants/theme';

/**
 * ThemeContext
 *
 * Single source of truth for the light/dark theme. The active theme is
 * mirrored to <html data-theme="…"> (consumed by design tokens) and to the
 * `dark` class (consumed by Tailwind's `darkMode: 'class'`).
 */
// eslint-disable-next-line react-refresh/only-export-components -- context object is consumed by hooks/useTheme.
export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this session */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
