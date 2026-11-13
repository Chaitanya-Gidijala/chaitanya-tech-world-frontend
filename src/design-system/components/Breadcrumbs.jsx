import { Link } from 'react-router-dom';
import clsx from 'clsx';

/**
 * Breadcrumbs
 * @param {{ label: string, to?: string }[]} items  last item is treated as the current page
 */
export default function Breadcrumbs({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('ds-breadcrumbs', className)}>
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label}>
              {isLast || !item.to ? (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
