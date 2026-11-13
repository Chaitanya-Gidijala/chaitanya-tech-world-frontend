import { useCallback, useMemo, useState } from 'react';

/**
 * useExpandableSet — tracks which items in a list of disclosures are open.
 * @param {string[]} ids         all item ids
 * @param {string[]} initialOpen ids open on first render
 */
export function useExpandableSet(ids, initialOpen = []) {
  const [open, setOpen] = useState(() => new Set(initialOpen));

  const isOpen = useCallback((id) => open.has(id), [open]);

  const setItem = useCallback((id, value) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const allOpen = useMemo(() => ids.length > 0 && ids.every((id) => open.has(id)), [ids, open]);

  const toggleAll = useCallback(() => {
    setOpen(allOpen ? new Set() : new Set(ids));
  }, [allOpen, ids]);

  return { isOpen, setItem, allOpen, toggleAll };
}
