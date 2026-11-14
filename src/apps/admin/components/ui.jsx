import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { Sparkline } from './charts';

export function Panel({ title, subtitle, actions, children, className, padded = true, id }) {
  return (
    <section className={clsx('ad-panel', className)} aria-labelledby={title ? id : undefined}>
      {(title || actions) && (
        <header className="ad-panel__head">
          <div>
            {title && (
              <h2 id={id} className="ad-panel__title">
                {title}
              </h2>
            )}
            {subtitle && <p className="ad-panel__sub">{subtitle}</p>}
          </div>
          {actions && <div className="ad-panel__actions">{actions}</div>}
        </header>
      )}
      <div className={clsx(padded && 'ad-panel__body')}>{children}</div>
    </section>
  );
}

export function StatTile({ label, value, hint, icon: Icon, trend, series = 1, tone, live }) {
  return (
    <div className={clsx('ad-stat', tone && `is-${tone}`)}>
      <div className="ad-stat__top">
        <span className="ad-stat__label">
          {live && <span className="ad-live-dot" aria-hidden="true" />}
          {label}
        </span>
        {Icon && <Icon size={16} aria-hidden="true" className="ad-stat__icon" />}
      </div>
      <div className="ad-stat__value">{value}</div>
      {hint && <div className="ad-stat__hint">{hint}</div>}
      {trend && <Sparkline values={trend} series={series} />}
    </div>
  );
}

const TONE_LABEL = { success: 'OK', warning: 'Warning', danger: 'Critical', info: 'Info', muted: '—' };

/** Status pill — always icon/text + colour, never colour alone. */
export function StatusPill({ tone = 'muted', children }) {
  return (
    <span className={clsx('ad-pill', `is-${tone}`)}>
      <span className="ad-pill__dot" aria-hidden="true" />
      {children ?? TONE_LABEL[tone]}
    </span>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="ad-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={clsx('ad-seg__btn', value === o.value && 'is-active')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
          {o.count != null && <span className="ad-seg__count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Slide-over drawer (right on desktop, bottom sheet on mobile). */
export function Drawer({ open, onClose, title, children, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ad-drawer" role="presentation">
      <div className="ad-drawer__backdrop" onClick={onClose} />
      <aside
        ref={ref}
        className={clsx('ad-drawer__panel', wide && 'is-wide')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className="ad-drawer__head">
          <h2>{title}</h2>
          <button type="button" className="ad-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="ad-drawer__body">{children}</div>
      </aside>
    </div>
  );
}

export function KeyValues({ items }) {
  return (
    <dl className="ad-kv">
      {items
        .filter((i) => i)
        .map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v ?? '—'}</dd>
          </div>
        ))}
    </dl>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="ad-empty">
      {Icon && <Icon size={28} aria-hidden="true" />}
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="ad-skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} style={{ width: `${70 + ((i * 37) % 30)}%` }} />
      ))}
    </div>
  );
}

export function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="ad-error" role="alert">
      <span>{error.message ?? String(error)}</span>
      {onRetry && (
        <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <header className="ad-page-head">
      <div>
        <h1 className="ad-page-head__title">{title}</h1>
        {description && <p className="ad-page-head__desc">{description}</p>}
      </div>
      {actions && <div className="ad-page-head__actions">{actions}</div>}
    </header>
  );
}
