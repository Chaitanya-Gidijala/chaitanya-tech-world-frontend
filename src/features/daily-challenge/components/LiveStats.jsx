import clsx from 'clsx';
import { formatDuration } from '@/features/engagement/lib/dates';
import LiveNumber from './LiveNumber';

const STATUS_LABEL = {
  live: 'Live',
  polling: 'Updating',
  connecting: 'Connecting…',
  offline: 'Offline',
};

export function LiveIndicator({ status, liveNow }) {
  return (
    <span className={clsx('dc-live', `dc-live--${status}`)} aria-live="polite">
      <span className="dc-live__dot" aria-hidden="true" />
      {status === 'live' && liveNow != null ? (
        <>
          <strong>
            <LiveNumber value={liveNow} />
          </strong>{' '}
          {liveNow === 1 ? 'person' : 'people'} here now
        </>
      ) : (
        STATUS_LABEL[status]
      )}
    </span>
  );
}

/** Community stats for today's puzzle, updating in real time. */
export default function LiveStats({ stats, status, myScore }) {
  if (!stats) {
    return (
      <div className="dc-stats dc-stats--empty">
        <LiveIndicator status={status} />
        <p className="ds-meta">
          {status === 'offline'
            ? 'Community stats are taking a nap. Your result is still saved on this device.'
            : 'Loading today’s community stats…'}
        </p>
      </div>
    );
  }

  const dist = stats.distribution ?? [0, 0, 0, 0];
  const peak = Math.max(...dist, 1);
  const total = stats.completions ?? dist.reduce((a, b) => a + b, 0);

  return (
    <div className="dc-stats">
      <div className="dc-stats__head">
        <h3 className="dc-stats__title">Today, worldwide</h3>
        <LiveIndicator status={status} liveNow={stats.liveNow} />
      </div>

      <dl className="dc-stats__grid">
        <div>
          <dt>Players</dt>
          <dd>
            <LiveNumber value={total} />
          </dd>
        </div>
        <div>
          <dt>Avg score</dt>
          <dd>{total ? (stats.averageScore ?? 0).toFixed(1) : '–'}</dd>
        </div>
        <div>
          <dt>Perfect</dt>
          <dd>{total ? `${Math.round(((dist[3] ?? 0) / total) * 100)}%` : '–'}</dd>
        </div>
        <div>
          <dt>Avg time</dt>
          <dd>{stats.averageDurationMs ? formatDuration(stats.averageDurationMs) : '–'}</dd>
        </div>
      </dl>

      <ol className="dc-dist" aria-label="Score distribution">
        {[3, 2, 1, 0].map((score) => {
          const count = dist[score] ?? 0;
          return (
            <li key={score} className={clsx('dc-dist__row', myScore === score && 'is-mine')}>
              <span className="dc-dist__label">{score}/3</span>
              <span className="dc-dist__track">
                <span className="dc-dist__bar" style={{ '--w': `${(count / peak) * 100}%` }} />
              </span>
              <span className="dc-dist__count">{count}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
