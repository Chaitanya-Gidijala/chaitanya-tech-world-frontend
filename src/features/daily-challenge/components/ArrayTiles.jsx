import clsx from 'clsx';

/** A compact array: value tiles with proportional bars above them. */
export default function ArrayTiles({ values, highlight, size = 'md', className, label }) {
  const max = Math.max(...values, 1);
  return (
    <div className={clsx('dc-array', `dc-array--${size}`, className)} role="img" aria-label={label ?? `[${values.join(', ')}]`}>
      {values.map((v, i) => (
        <span key={`${i}-${v}`} className={clsx('dc-array__item', highlight === v && 'is-target')}>
          <span className="dc-array__bar" style={{ '--h': `${Math.max(12, (v / max) * 100)}%` }} aria-hidden="true" />
          <span className="dc-array__value">{v}</span>
        </span>
      ))}
    </div>
  );
}
