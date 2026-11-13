import { forwardRef, useId } from 'react';
import clsx from 'clsx';

/** Shared label / hint / error wrapper for all form controls. */
function FieldShell({ id, label, hint, error, className, children }) {
  return (
    <div className={clsx('ds-field', error && 'has-error', className)}>
      {label && (
        <label className="ds-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="ds-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="ds-field__hint" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id, hint, error) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export const TextField = forwardRef(function TextField(
  { label, hint, error, className, id: idProp, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input
        ref={ref}
        id={id}
        className="ds-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
});

export const TextArea = forwardRef(function TextArea(
  { label, hint, error, className, id: idProp, rows = 5, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className="ds-input ds-input--textarea"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
});

/**
 * SelectField
 * @param {{ value: string, label: string }[]} options
 */
export const SelectField = forwardRef(function SelectField(
  { label, hint, error, options = [], className, id: idProp, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <div className="ds-select">
        <select ref={ref} id={id} className="ds-input ds-select__control" {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg className="ds-select__chevron" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </FieldShell>
  );
});
