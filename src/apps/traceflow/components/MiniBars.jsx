import clsx from 'clsx';

/** MiniBars — tiny static bar chart of an algorithm's default input (card thumbnail). */
export default function MiniBars({ values, highlight = [], className }) {
  const max = Math.max(...values, 1);
  return (
    <div className={clsx('tfp-minibars', className)} aria-hidden="true">
      {values.map((v, i) => (
        <span
          key={i}
          className={highlight.includes(i) ? 'is-hl' : undefined}
          style={{ height: `${Math.max(8, (v / max) * 100)}%`, '--i': i }}
        />
      ))}
    </div>
  );
}
