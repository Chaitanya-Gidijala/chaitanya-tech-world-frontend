import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Spinner from './Spinner';

/**
 * Button — the single call-to-action primitive.
 *
 * Renders a router <Link> when `to` is set, an <a> when `href` is set,
 * otherwise a <button>.
 *
 * @param {'primary'|'secondary'|'ghost'|'link'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {import('react').ReactNode} iconStart  icon rendered before the label
 * @param {import('react').ReactNode} iconEnd    icon rendered after the label
 * @param {boolean} loading  shows a spinner and disables the button
 * @param {boolean} block    stretches to the container width
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    to,
    href,
    iconStart,
    iconEnd,
    loading = false,
    block = false,
    disabled,
    className,
    children,
    type,
    ...rest
  },
  ref,
) {
  const classes = clsx(
    'ds-btn',
    `ds-btn--${variant}`,
    `ds-btn--${size}`,
    block && 'ds-btn--block',
    loading && 'is-loading',
    className,
  );

  const content = (
    <>
      {loading ? <Spinner size={14} /> : iconStart}
      {children && <span className="ds-btn__label">{children}</span>}
      {!loading && iconEnd}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
});

export default Button;
