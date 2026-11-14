import { useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

/**
 * Small, dependency-free SVG charts for the admin dashboard.
 *
 * Conventions (dataviz method): one axis per chart, 2px lines, a soft area fill,
 * recessive grid, a crosshair + tooltip on hover/focus, values in text ink (never
 * the series colour), and a visually-hidden table for screen readers.
 */

function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(120, Math.round(entry.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

function niceMax(v) {
  if (v <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(v));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * exp;
}

/**
 * AreaChart — one series over time.
 * @param {{x:number,y:number}[]} data
 */
export function AreaChart({
  data,
  height = 180,
  series = 1,
  label,
  formatY = (v) => v.toLocaleString(),
  formatX = (x) => new Date(x).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  emptyText = 'No data yet',
}) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const gid = useId().replace(/:/g, '');
  const pad = { top: 12, right: 12, bottom: 24, left: 40 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const { points, max, path, area } = useMemo(() => {
    if (!data?.length) return { points: [], max: 1, path: '', area: '' };
    const top = niceMax(Math.max(...data.map((d) => d.y), 0));
    const step = data.length > 1 ? w / (data.length - 1) : 0;
    const pts = data.map((d, i) => ({ ...d, px: pad.left + i * step, py: pad.top + h - (d.y / top) * h }));
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ');
    const fill = `${line} L${pts.at(-1).px.toFixed(1)},${pad.top + h} L${pts[0].px.toFixed(1)},${pad.top + h} Z`;
    return { points: pts, max: top, path: line, area: fill };
  }, [data, w, h, pad.left, pad.top]);

  const onMove = (e) => {
    if (!points.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(p.px - x) < Math.abs(points[best].px - x)) best = i;
    });
    setHover(best);
  };

  const onKey = (e) => {
    if (!points.length) return;
    if (e.key === 'ArrowLeft') setHover((v) => Math.max(0, (v ?? points.length) - 1));
    if (e.key === 'ArrowRight') setHover((v) => Math.min(points.length - 1, (v ?? -1) + 1));
    if (e.key === 'Escape') setHover(null);
  };

  const hp = hover != null ? points[hover] : null;
  const ticks = [0, 0.5, 1].map((f) => ({ v: max * f, y: pad.top + h - f * h }));
  const xTicks = points.length > 1 ? [points[0], points[Math.floor((points.length - 1) / 2)], points.at(-1)] : points;

  return (
    <div ref={ref} className="ad-chart" style={{ height }}>
      {!data?.length ? (
        <div className="ad-chart__empty">{emptyText}</div>
      ) : (
        <>
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={label}
            tabIndex={0}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            onKeyDown={onKey}
            onBlur={() => setHover(null)}
            className={`ad-chart__svg ad-series-${series}`}
          >
            <defs>
              <linearGradient id={`g${gid}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((t) => (
              <g key={t.y}>
                <line x1={pad.left} x2={width - pad.right} y1={t.y} y2={t.y} className="ad-chart__grid" />
                <text x={pad.left - 8} y={t.y + 4} textAnchor="end" className="ad-chart__tick">
                  {formatY(Math.round(t.v * 100) / 100)}
                </text>
              </g>
            ))}
            {xTicks.map((p, i) => (
              <text
                key={`${p.x}-${i}`}
                x={p.px}
                y={height - 6}
                textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}
                className="ad-chart__tick"
              >
                {formatX(p.x)}
              </text>
            ))}
            <path d={area} fill={`url(#g${gid})`} />
            <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {hp && (
              <>
                <line x1={hp.px} x2={hp.px} y1={pad.top} y2={pad.top + h} className="ad-chart__cross" />
                <circle cx={hp.px} cy={hp.py} r="4.5" fill="currentColor" className="ad-chart__dot" />
              </>
            )}
          </svg>
          {hp && (
            <div
              className="ad-tooltip"
              style={{ left: Math.min(Math.max(hp.px, 70), width - 70), top: Math.max(hp.py - 12, 0) }}
              role="status"
            >
              <span className="ad-tooltip__x">{formatX(hp.x)}</span>
              <strong>{formatY(hp.y)}</strong>
            </div>
          )}
          <table className="ds-visually-hidden">
            <caption>{label}</caption>
            <tbody>
              {data.slice(-30).map((d) => (
                <tr key={d.x}>
                  <th scope="row">{formatX(d.x)}</th>
                  <td>{formatY(d.y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

/** Sparkline — tiny trend inside a stat tile (no axes; the tile states the value). */
export function Sparkline({ values, series = 1, height = 36 }) {
  const [ref, width] = useWidth();
  if (!values?.length || values.length < 2) return <div ref={ref} className="ad-spark" style={{ height }} />;
  // Headroom keeps a flat series as a line in the upper part of the tile, not a solid block.
  const max = Math.max(...values, 1) * 1.25;
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(height - 3 - ((v - min) / span) * (height - 6)).toFixed(1)}`).join(' ');
  return (
    <div ref={ref} className={`ad-spark ad-series-${series}`} style={{ height }} aria-hidden="true">
      <svg width={width} height={height}>
        <path d={`${d} L${width},${height} L0,${height} Z`} fill="currentColor" opacity="0.08" />
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** BarList — ranked horizontal bars with labels and counts (single hue). */
export function BarList({ items, empty = 'Nothing yet', format = (v) => v.toLocaleString(), renderName, max: maxItems = 8 }) {
  if (!items?.length) return <p className="ad-empty-line">{empty}</p>;
  const list = items.slice(0, maxItems);
  const peak = Math.max(...list.map((i) => i.count), 1);
  return (
    <ul className="ad-barlist">
      {list.map((item) => (
        <li key={item.name} title={`${item.name}: ${format(item.count)}`}>
          <span className="ad-barlist__bar" style={{ '--w': `${(item.count / peak) * 100}%` }} />
          <span className="ad-barlist__name">{renderName ? renderName(item) : item.name}</span>
          <span className="ad-barlist__count">{format(item.count)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Meter — labelled usage bar; status tone only when thresholds are crossed. */
export function Meter({ label, value, max, display, warn = 0.75, danger = 0.9 }) {
  const ratio = max ? Math.min(1, value / max) : 0;
  const tone = ratio >= danger ? 'danger' : ratio >= warn ? 'warning' : 'ok';
  return (
    <div className="ad-meter">
      <div className="ad-meter__top">
        <span>{label}</span>
        <span className="ad-meter__val">{display}</span>
      </div>
      <div
        className={clsx('ad-meter__track', `is-${tone}`)}
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max || 100}
        aria-valuenow={value || 0}
      >
        <span style={{ '--p': `${ratio * 100}%` }} />
      </div>
    </div>
  );
}

/** UptimeBars — one cell per probe, newest on the right. */
export function UptimeBars({ history, slots = 60 }) {
  const cells = [...Array(Math.max(0, slots - (history?.length ?? 0))).fill(null), ...(history ?? []).slice(-slots)];
  return (
    <div className="ad-uptime" role="img" aria-label={`${history?.filter((h) => h.up).length ?? 0} of ${history?.length ?? 0} checks up`}>
      {cells.map((c, i) => (
        <span
          key={i}
          className={clsx('ad-uptime__cell', !c ? 'is-empty' : c.up ? 'is-up' : 'is-down')}
          title={c ? `${new Date(c.at).toLocaleTimeString()} · ${c.up ? 'UP' : 'DOWN'} · ${c.status || '—'} · ${c.latencyMs}ms${c.error ? ` · ${c.error}` : ''}` : 'No data'}
        />
      ))}
    </div>
  );
}
