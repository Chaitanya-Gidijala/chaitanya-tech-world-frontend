import { useId, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

/**
 * Disclosure — accessible expand/collapse panel.
 *
 * Works controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 * `summary` is the always-visible header content (phrasing content only — it
 * renders inside a <button>); `children` is the panel.
 * `headingLevel` wraps the trigger in an <h2>–<h6> so the outline is navigable.
 */
export default function Disclosure({
  summary,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  id,
  headingLevel = 3,
  className,
  children,
}) {
  const Heading = `h${headingLevel}`;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : innerOpen;
  const panelId = useId();

  const toggle = () => {
    const next = !open;
    if (!isControlled) setInnerOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div id={id} className={clsx('ds-disclosure', open && 'is-open', className)}>
      <Heading className="ds-disclosure__heading">
        <button
          type="button"
          className="ds-disclosure__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
        >
          <span className="ds-disclosure__summary">{summary}</span>
          <ChevronDown className="ds-disclosure__chevron" size={18} aria-hidden="true" />
        </button>
      </Heading>
      {open && (
        <div id={panelId} className="ds-disclosure__panel">
          {children}
        </div>
      )}
    </div>
  );
}
