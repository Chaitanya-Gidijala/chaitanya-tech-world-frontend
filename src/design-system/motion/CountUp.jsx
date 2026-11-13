import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * CountUp — animates the numeric part of a value ("350+", "50k+", 72) when it
 * scrolls into view. Non-numeric values ("Free") render unchanged.
 */
export default function CountUp({ value, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();

  const match = String(value).match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2]) : null;
  const [display, setDisplay] = useState(match && !reduce ? 0 : target);

  useEffect(() => {
    if (!inView || target == null || reduce) return undefined;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Number.isInteger(target) ? Math.round(v) : v.toFixed(1)),
    });
    return () => controls.stop();
  }, [inView, target, duration, reduce]);

  if (!match) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref} aria-label={String(value)}>
      <span aria-hidden="true">
        {match[1]}
        {display}
        {match[3]}
      </span>
    </span>
  );
}
