import clsx from 'clsx';
import Reveal from '../motion/Reveal';
import CountUp from '../motion/CountUp';

/**
 * Container — horizontally centred, gutter-padded page column.
 * @param {'default'|'wide'|'narrow'} size
 */
export function Container({ as: Tag = 'div', size = 'default', className, children, ...rest }) {
  return (
    <Tag className={clsx('ds-container', size !== 'default' && `ds-container--${size}`, className)} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Section — vertical rhythm wrapper for a page section.
 * @param {boolean} bordered  draws a hairline above the section
 * @param {boolean} compact   halves the vertical padding
 */
export function Section({ as: Tag = 'section', bordered = false, compact = false, className, children, ...rest }) {
  return (
    <Tag
      className={clsx('ds-section', bordered && 'ds-section--bordered', compact && 'ds-section--compact', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Eyebrow — small pill label used above headings. */
export function Eyebrow({ className, children }) {
  return (
    <p className={clsx('ds-eyebrow', className)}>
      <span className="ds-eyebrow__dot" aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * SectionHeader — eyebrow + title + description, with optional right-aligned actions.
 * Animates in when scrolled into view.
 *
 * @param {1|2|3} level  heading level rendered (h1/h2/h3)
 * @param {import('react').ReactNode} title  may include <span className="ds-gradient-text">
 */
export function SectionHeader({ eyebrow, title, description, actions, level = 2, align = 'start', className, id }) {
  const Heading = `h${level}`;
  return (
    <Reveal as="header" className={clsx('ds-section-header', `ds-section-header--${align}`, className)}>
      <div className="ds-section-header__text">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading id={id} className={clsx('ds-section-header__title', level === 1 && 'ds-display')}>
          {title}
        </Heading>
        {description && <p className="ds-section-header__desc">{description}</p>}
      </div>
      {actions && <div className="ds-section-header__actions">{actions}</div>}
    </Reveal>
  );
}

/** Card — bordered surface. `interactive` adds hover lift, gradient edge and cursor spotlight. */
export function Card({ as: Tag = 'div', interactive = false, padding = 'md', className, children, ...rest }) {
  return (
    <Tag
      className={clsx('ds-card', `ds-card--pad-${padding}`, interactive && 'ds-card--interactive', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** StatGroup — animated figures (numbers count up on first view). */
export function StatGroup({ items = [], className }) {
  return (
    <dl className={clsx('ds-stats', className)}>
      {items.map(({ label, value }, i) => (
        <Reveal key={label} className="ds-stat" delay={i * 0.08}>
          <dt className="ds-stat__label">{label}</dt>
          <dd className="ds-stat__value">
            <CountUp value={value} />
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
