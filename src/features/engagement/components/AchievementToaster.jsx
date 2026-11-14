import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import { progressStore } from '../lib/store';
import { celebrate } from '../lib/celebrate';

/** Global toast host + listener that announces newly unlocked achievements. */
export default function AchievementToaster() {
  const { theme } = useTheme();

  useEffect(
    () =>
      progressStore.onAchievement((a) => {
        toast(`${a.icon}  ${a.title}`, { description: `Achievement unlocked: ${a.text}`, duration: 5000 });
        if (a.celebrate) celebrate();
      }),
    [],
  );

  return <Toaster position="bottom-right" theme={theme === 'light' ? 'light' : 'dark'} richColors closeButton />;
}

