import { useEffect } from 'react';

const SELECTOR = '.ds-card--interactive, .ds-spotlight';

/**
 * useSpotlight — one delegated pointer listener that feeds the cursor position
 * (as --mx / --my) to whichever spotlight card is under the pointer. Mount it
 * once per page shell; any element with `.ds-card--interactive` or
 * `.ds-spotlight` then gets the hover light effect without extra code.
 */
export function useSpotlight() {
  useEffect(() => {
    if (window.matchMedia?.('(pointer: coarse)').matches) return undefined;

    let frame = 0;
    const onMove = (e) => {
      const el = e.target instanceof Element ? e.target.closest(SELECTOR) : null;
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
    };
  }, []);
}
