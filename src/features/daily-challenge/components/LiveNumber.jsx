import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

/** A number that tweens from its previous value and pulses when a live update lands. */
export default function LiveNumber({ value }) {
  const reduce = useReducedMotion();
  const prev = useRef(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (from === value || reduce) return undefined;
    const controls = animate(from, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduce]);

  const shown = reduce ? value : display;
  // Re-keying on value restarts the CSS pulse whenever a new number arrives.
  return (
    <span key={value} className="dc-pulse">
      {Number(shown).toLocaleString()}
    </span>
  );
}
