import clsx from 'clsx';
import { AuroraBackground, Breadcrumbs, Container, Eyebrow, StatGroup } from '@/design-system';
import './site.css';

/**
 * PageHero — standard top-of-page block for content pages, over an animated aurora.
 *
 * @param {{label:string,to?:string}[]} breadcrumbs
 * @param {string} eyebrow
 * @param {import('react').ReactNode} title     may include <span className="ds-gradient-text">
 * @param {import('react').ReactNode} description
 * @param {import('react').ReactNode} meta      badges rendered above the title
 * @param {import('react').ReactNode} actions   buttons rendered below the description
 * @param {{label:string,value:any}[]} stats
 * @param {import('react').ReactNode} aside     optional right-hand column
 */
export default function PageHero({ breadcrumbs, eyebrow, title, description, meta, actions, stats, aside, className }) {
  return (
    <section className={clsx('page-hero', className)}>
      <AuroraBackground />
      <Container>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="page-hero__crumbs ds-rise" />}
        <div className={clsx('page-hero__grid', aside && 'has-aside')}>
          <div className="page-hero__copy">
            {meta && <div className="page-hero__meta ds-rise">{meta}</div>}
            {eyebrow && (
              <div className="ds-rise">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h1 className="page-hero__title ds-rise" style={{ animationDelay: '80ms' }}>
              {title}
            </h1>
            {description && (
              <p className="page-hero__desc ds-rise" style={{ animationDelay: '160ms' }}>
                {description}
              </p>
            )}
            {actions && (
              <div className="page-hero__actions ds-rise" style={{ animationDelay: '240ms' }}>
                {actions}
              </div>
            )}
          </div>
          {aside && (
            <div className="page-hero__aside ds-rise" style={{ animationDelay: '200ms' }}>
              {aside}
            </div>
          )}
        </div>
        {stats && <StatGroup items={stats} className="page-hero__stats" />}
      </Container>
    </section>
  );
}
