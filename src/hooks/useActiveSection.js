import { useEffect, useState } from 'react';

/**
 * useActiveSection — returns the id of the section currently in view,
 * used to highlight the matching in-page nav link.
 */
export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(null);
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      // A thin band across the upper-middle of the viewport decides the active section.
      { rootMargin: '-35% 0px -60% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
