import clsx from 'clsx';

/**
 * AuroraBackground — slow-moving gradient light field with a fading dot grid.
 * Purely decorative; place inside a `position: relative` container.
 *
 * @param {'hero'|'subtle'} intensity
 */
export default function AuroraBackground({ intensity = 'hero', className }) {
  return (
    <div className={clsx('ds-aurora', `ds-aurora--${intensity}`, className)} aria-hidden="true">
      <span className="ds-aurora__blob ds-aurora__blob--1" />
      <span className="ds-aurora__blob ds-aurora__blob--2" />
      <span className="ds-aurora__blob ds-aurora__blob--3" />
      <span className="ds-aurora__grid" />
    </div>
  );
}
