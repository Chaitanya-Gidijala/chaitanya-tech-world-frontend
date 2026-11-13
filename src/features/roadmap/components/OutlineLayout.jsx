import clsx from 'clsx';
import { useActiveSection } from '@/hooks/useActiveSection';

/**
 * OutlineLayout — two-column layout with a sticky, scroll-spied outline.
 *
 * @param {string} title  outline heading
 * @param {{ id: string, label: string, meta?: string }[]} items  anchors for the outline
 * @param {(id: string) => void} onSelect  called when an outline item is clicked (e.g. to expand it)
 */
export default function OutlineLayout({ title, items, onSelect, toolbar, children }) {
  const activeId = useActiveSection(items.map((i) => i.id));

  const handleClick = (e, id) => {
    e.preventDefault();
    onSelect?.(id);
    // Wait a frame so a newly expanded panel is laid out before scrolling.
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="rm-outline-layout">
      <aside className="rm-outline" aria-label={title}>
        <p className="ds-eyebrow rm-outline__title">{title}</p>
        <ol className="rm-outline__list">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={clsx('rm-outline__link', activeId === item.id && 'is-active')}
                aria-current={activeId === item.id ? 'location' : undefined}
                onClick={(e) => handleClick(e, item.id)}
              >
                <span className="rm-outline__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="rm-outline__label">{item.label}</span>
                {item.meta && <span className="rm-outline__meta">{item.meta}</span>}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <div className="rm-outline-layout__main">
        {toolbar && <div className="rm-toolbar">{toolbar}</div>}
        {children}
      </div>
    </div>
  );
}
