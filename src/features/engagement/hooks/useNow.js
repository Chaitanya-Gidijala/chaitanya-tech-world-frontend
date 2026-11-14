import { useEffect, useState } from 'react';
import { msUntilMidnight, todayKey } from '../lib/dates';

/** Current time, re-rendering every `intervalMs` (default 1s). */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Today's day key; re-renders exactly at local midnight so new puzzles appear without a reload. */
export function useToday() {
  const [today, setToday] = useState(todayKey);
  useEffect(() => {
    let timer;
    const schedule = () => {
      timer = setTimeout(() => {
        setToday(todayKey());
        schedule();
      }, msUntilMidnight() + 250);
    };
    schedule();
    const onVisible = () => document.visibilityState === 'visible' && setToday(todayKey());
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
  return today;
}
