import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * IconButton — square button containing only an icon.
 * `label` is required: it becomes the accessible name and the tooltip.
 */
const IconButton = forwardRef(function IconButton(
  { label, href, size = 'md', variant = 'ghost', className, children, ...rest },
  ref,
) {
  const classes = clsx('ds-icon-btn', `ds-icon-btn--${size}`, `ds-icon-btn--${variant}`, className);

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} aria-label={label} title={label} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type="button" className={classes} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
});

export default IconButton;
