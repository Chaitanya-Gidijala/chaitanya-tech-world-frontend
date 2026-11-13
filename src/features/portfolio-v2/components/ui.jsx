import clsx from 'clsx';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Spinner } from '@/design-system';

/**
 * Portfolio-only UI primitives. Styled exclusively by portfolio.css (`pf-` prefix)
 * so the portfolio's look is independent from the rest of the site.
 */

const EASE = [0.22, 1, 0.36, 1];

/** PfButton — renders <a> when `href` is set, otherwise <button>. */
export function PfButton({ href, variant = 'primary', iconStart, iconEnd, loading, className, children, ...rest }) {
  const classes = clsx('pf-btn', `pf-btn--${variant}`, loading && 'is-loading', className);
  const content = (
    <>
      {loading ? <Spinner size={15} /> : iconStart}
      <span>{children}</span>
      {!loading && iconEnd}
    </>
  );
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} disabled={loading || rest.disabled} {...rest}>
      {content}
    </button>
  );
}

/** FadeIn — reveal-on-scroll wrapper. */
export function FadeIn({ as = 'div', delay = 0, y = 28, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * SectionHeading — numbered kicker + big display title.
 * `accent` is rendered in the gradient after `title`.
 */
export function SectionHeading({ number, kicker, title, accent, description, id, align = 'start' }) {
  return (
    <FadeIn className={clsx('pf-heading', align === 'center' && 'pf-heading--center')}>
      <p className="pf-kicker">
        <span className="pf-kicker__num">{number}</span>
        <span className="pf-kicker__line" aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className="pf-heading__title">
        {title} {accent && <span className="pf-gradient">{accent}</span>}
      </h2>
      {description && <p className="pf-heading__desc">{description}</p>}
    </FadeIn>
  );
}

/** TiltCard — card that tilts in 3D toward the pointer and shows a moving glare. */
export function TiltCard({ as = 'article', className, children, ...rest }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [7, -7]);
  const rotateY = useTransform(sx, [0, 1], [-9, 9]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const Tag = motion[as] ?? motion.article;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <Tag
      className={clsx('pf-tilt', className)}
      style={reduce ? undefined : { rotateX, rotateY, '--gx': glareX, '--gy': glareY }}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reduce ? undefined : onLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
