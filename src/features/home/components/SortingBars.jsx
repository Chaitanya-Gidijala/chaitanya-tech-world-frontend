import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { motion, useReducedMotion } from 'framer-motion';

const DEFAULT_VALUES = [62, 28, 90, 45, 74, 18, 55, 83, 36, 68];
const HOLD_TICKS = 4; // ticks to show the sorted result before reshuffling

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * SortingBars — a self-running bubble sort, used as a live Traceflow preview.
 * One comparison per tick; swaps animate with layout transitions; once sorted
 * the result is held briefly and the array reshuffles.
 */
export default function SortingBars({ values = DEFAULT_VALUES, interval = 520, compact = false, className }) {
  const reduce = useReducedMotion();
  const n = values.length;
  const [bars, setBars] = useState(() => values.map((v, id) => ({ id, v })));
  const [active, setActive] = useState([-1, -1]);
  const [sortedFrom, setSortedFrom] = useState(n);
  const barsRef = useRef(bars);
  const cursor = useRef({ i: 0, j: 0, swapped: false, hold: 0 });

  useEffect(() => {
    if (reduce) return undefined;

    const commit = (next) => {
      barsRef.current = next;
      setBars(next);
    };

    const tick = () => {
      const c = cursor.current;

      // Holding the finished state, then restart with a fresh shuffle.
      if (c.hold > 0) {
        c.hold -= 1;
        if (c.hold === 0) {
          commit(shuffle(barsRef.current));
          setSortedFrom(n);
          Object.assign(c, { i: 0, j: 0, swapped: false });
        }
        return;
      }

      // End of a pass.
      if (c.j >= n - 1 - c.i) {
        if (!c.swapped || c.i >= n - 2) {
          setSortedFrom(0);
          setActive([-1, -1]);
          c.hold = HOLD_TICKS;
          return;
        }
        setSortedFrom(n - 1 - c.i);
        Object.assign(c, { i: c.i + 1, j: 0, swapped: false });
        return;
      }

      // Compare (and maybe swap) j and j + 1.
      const j = c.j;
      setActive([j, j + 1]);
      const cur = barsRef.current;
      if (cur[j].v > cur[j + 1].v) {
        const next = [...cur];
        [next[j], next[j + 1]] = [next[j + 1], next[j]];
        commit(next);
        c.swapped = true;
      }
      c.j += 1;
    };

    const timer = setInterval(tick, interval);
    return () => clearInterval(timer);
  }, [interval, n, reduce]);

  return (
    <div className={clsx('home-bars', compact && 'home-bars--compact', className)} aria-hidden="true">
      {bars.map((bar, idx) => (
        <motion.span
          key={bar.id}
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
          className={clsx('home-bars__bar', active.includes(idx) && 'is-active', idx >= sortedFrom && 'is-sorted')}
          style={{ height: `${bar.v}%` }}
        />
      ))}
    </div>
  );
}
