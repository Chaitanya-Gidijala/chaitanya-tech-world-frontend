import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import IconButton from './IconButton';

/** ThemeToggle — switches between light and dark using the global ThemeContext. */
export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <IconButton label={`Switch to ${next} theme`} onClick={toggleTheme} className={className}>
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </IconButton>
  );
}
