export const THEME_KEY = 'ctw-theme-preference';

export const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable — fall through to system preference */
  }
  // The site is designed dark-first; light is opt-in via the theme toggle.
  return 'dark';
};
