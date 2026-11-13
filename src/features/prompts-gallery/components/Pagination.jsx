import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/design-system';

/** Returns page numbers with `null` gaps, e.g. [1, null, 4, 5, 6, null, 12]. */
function pageWindow(current, total, radius = 1) {
  const pages = new Set([1, total]);
  for (let p = current - radius; p <= current + radius; p += 1) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [null, p] : [p]));
}

export default function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null;

  return (
    <nav className={clsx('pr-pagination', className)} aria-label="Pagination">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        iconStart={<ChevronLeft size={14} />}
      >
        Previous
      </Button>

      <ol className="pr-pagination__pages">
        {pageWindow(page, totalPages).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} className="pr-pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={clsx('pr-pagination__page', p === page && 'is-current')}
                onClick={() => onChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ol>

      <p className="pr-pagination__status">
        {page} / {totalPages}
      </p>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        iconEnd={<ChevronRight size={14} />}
      >
        Next
      </Button>
    </nav>
  );
}
