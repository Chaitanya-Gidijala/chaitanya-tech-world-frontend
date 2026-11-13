import { useSyncExternalStore } from 'react';

/**
 * useMediaQuery — live boolean for a CSS media query.
 *   const isWide = useMediaQuery('(min-width: 961px)');
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
