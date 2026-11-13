import clsx from 'clsx';
import './signature.css';

/**
 * DeveloperSignature — "Developed by Chaitanya Gidijala" credit.
 *
 * @param {'inline'|'display'} variant
 *   inline  — compact one-line credit for the site footer bar
 *   display — large statement version used by the portfolio footer
 */
export default function DeveloperSignature({ variant = 'display', className }) {
  if (variant === 'inline') {
    return (
      <p className={clsx('dev-sig', className)}>
        <span className="dev-sig__chip" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
            <path d="m8 7-5 5 5 5M16 7l5 5-5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="dev-sig__label">Developed by</span>
        <span className="dev-sig__name">Chaitanya Gidijala</span>
      </p>
    );
  }

  return (
    <p className={clsx('dev-signature', className)}>
      <span className="dev-signature__label">
        <span className="dev-signature__line" aria-hidden="true" />
        Developed by
      </span>
      <span className="dev-signature__name">Chaitanya Gidijala</span>
    </p>
  );
}
