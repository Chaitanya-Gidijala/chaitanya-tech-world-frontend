import clsx from 'clsx';

/**
 * Marquee — infinitely scrolling row. Content is duplicated once so the loop is
 * seamless; the copy is hidden from assistive tech. Pauses on hover.
 */
export default function Marquee({ items, renderItem, speed = 40, reverse = false, className }) {
  const row = (hidden) => (
    <ul className="ds-marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="ds-marquee__item">
          {renderItem ? renderItem(item) : item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={clsx('ds-marquee', reverse && 'ds-marquee--reverse', className)}
      style={{ '--marquee-duration': `${speed}s` }}
    >
      <div className="ds-marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
