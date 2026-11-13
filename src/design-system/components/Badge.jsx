import clsx from 'clsx';

/**
 * Badge — compact status label.
 * @param {'neutral'|'accent'|'success'|'warning'|'danger'|'info'} tone
 * @param {boolean} dot  prefix a status dot
 */
export function Badge({ tone = 'neutral', dot = false, className, children, ...rest }) {
  return (
    <span className={clsx('ds-badge', `ds-badge--${tone}`, className)} {...rest}>
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Tag — neutral outlined chip for keywords and technologies. */
export function Tag({ className, children, ...rest }) {
  return (
    <span className={clsx('ds-tag', className)} {...rest}>
      {children}
    </span>
  );
}

/** TagList — wraps a list of strings as <Tag>s. */
export function TagList({ items = [], className }) {
  if (!items.length) return null;
  return (
    <ul className={clsx('ds-tag-list', className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
