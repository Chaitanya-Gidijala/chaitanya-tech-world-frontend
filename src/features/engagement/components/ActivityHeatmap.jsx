import { useMemo } from 'react';
import { addDays, fromDayKey, todayKey } from '../lib/dates';

const LEVELS = [0, 10, 25, 50]; // XP thresholds for intensity 1–4
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function intensity(xp) {
  if (!xp) return 0;
  let lvl = 0;
  LEVELS.forEach((t, i) => {
    if (xp > t) lvl = i + 1;
  });
  return Math.min(4, lvl);
}

/**
 * GitHub-style activity grid — one column per week (Mon → Sun), newest on the right.
 */
export default function ActivityHeatmap({ days, weeks = 26 }) {
  const { columns, months, total } = useMemo(() => {
    const today = todayKey();
    const dow = (fromDayKey(today).getDay() + 6) % 7; // 0 = Monday
    const start = addDays(today, -(weeks - 1) * 7 - dow);
    const cols = [];
    const monthLabels = [];
    let sum = 0;
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const key = addDays(start, w * 7 + d);
        const future = key > today;
        const xp = days[key]?.xp ?? 0;
        if (!future) sum += xp ? 1 : 0;
        col.push({ key, xp, future, level: intensity(xp) });
      }
      const first = fromDayKey(col[0].key);
      if (first.getDate() <= 7) monthLabels.push({ index: w, label: MONTHS[first.getMonth()] });
      cols.push(col);
    }
    return { columns: cols, months: monthLabels, total: sum };
  }, [days, weeks]);

  return (
    <figure className="eg-heatmap">
      <div className="eg-heatmap__scroll">
        <div className="eg-heatmap__months" style={{ '--weeks': weeks }} aria-hidden="true">
          {months.map((m) => (
            <span key={`${m.label}-${m.index}`} style={{ gridColumn: m.index + 1 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="eg-heatmap__body">
          <div className="eg-heatmap__days" aria-hidden="true">
            {DAY_LABELS.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
          <div className="eg-heatmap__grid" role="img" aria-label={`${total} active days in the last ${weeks} weeks`}>
            {columns.map((col, w) => (
              <div key={w} className="eg-heatmap__col">
                {col.map((cell) => (
                  <span
                    key={cell.key}
                    className={`eg-heatmap__cell eg-heatmap__cell--${cell.future ? 'future' : cell.level}`}
                    title={cell.future ? undefined : `${cell.key}: ${cell.xp} XP`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="eg-heatmap__legend">
        <span>
          {total} active day{total === 1 ? '' : 's'} in the last {weeks} weeks
        </span>
        <span className="eg-heatmap__scale" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`eg-heatmap__cell eg-heatmap__cell--${l}`} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
