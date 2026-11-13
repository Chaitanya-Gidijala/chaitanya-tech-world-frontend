import clsx from 'clsx';

/** Spinner — inline loading indicator that inherits the current text colour. */
export default function Spinner({ size = 16, label, className }) {
  return (
    <span
      className={clsx('ds-spinner', className)}
      style={{ width: size, height: size }}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
