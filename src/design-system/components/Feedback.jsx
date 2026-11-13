import clsx from 'clsx';

/** Skeleton — shimmering placeholder block. */
export function Skeleton({ width, height = 12, radius, className, style }) {
  return (
    <span
      className={clsx('ds-skeleton', className)}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

/** EmptyState — centred message with optional icon and action. */
export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={clsx('ds-empty', className)}>
      {icon && <div className="ds-empty__icon">{icon}</div>}
      <h3 className="ds-empty__title">{title}</h3>
      {description && <p className="ds-empty__desc">{description}</p>}
      {action && <div className="ds-empty__action">{action}</div>}
    </div>
  );
}

/**
 * Callout — inline message box.
 * @param {'neutral'|'accent'|'warning'|'danger'} tone
 */
export function Callout({ tone = 'neutral', icon, title, action, className, children }) {
  return (
    <div className={clsx('ds-callout', `ds-callout--${tone}`, className)} role={tone === 'danger' ? 'alert' : undefined}>
      {icon && <span className="ds-callout__icon">{icon}</span>}
      <div className="ds-callout__body">
        {title && <p className="ds-callout__title">{title}</p>}
        {children && <div className="ds-callout__text">{children}</div>}
      </div>
      {action && <div className="ds-callout__action">{action}</div>}
    </div>
  );
}
