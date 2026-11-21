import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { BadgeCheck, Crown, Flame, Medal, Trophy } from 'lucide-react';
import { getLearnerId } from '@/features/engagement/lib/store';
import { formatDuration } from '@/features/engagement/lib/dates';
import { openAuth, useAccount } from '@/features/account/session';
import { growthApi } from './api';
import './growth.css';

const BOARDS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'streaks', label: 'Streaks' },
];

const RANK_ICON = { 1: Crown, 2: Medal, 3: Medal };

function value(board, e) {
  if (board === 'streaks') return { main: `${e.streak} day${e.streak === 1 ? '' : 's'}`, sub: `${e.played} puzzles` };
  if (board === 'week') return { main: `${e.score} pts`, sub: `${e.played} played · ${formatDuration(e.durationMs)}` };
  return { main: `${e.score}/3`, sub: formatDuration(e.durationMs) };
}

/** Leaderboard table with tabs; `compact` shows the top 5 for embedding. */
export default function Leaderboard({ compact = false, initial = 'today' }) {
  const [board, setBoard] = useState(initial);
  const account = useAccount();
  const learnerId = getLearnerId();
  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', board, learnerId],
    queryFn: () => growthApi.leaderboard(board, learnerId, compact ? 5 : 50),
    refetchInterval: 30_000,
  });

  const entries = data?.entries ?? [];
  const you = data?.you && data.you.rank ? data.you : null;
  const youVisible = you && entries.some((e) => e.you);

  return (
    <div className={clsx('gr-board', compact && 'is-compact')}>
      <div className="gr-board__head">
        <div className="gr-tabs" role="tablist" aria-label="Leaderboard">
          {BOARDS.map((b) => (
            <button key={b.id} type="button" role="tab" aria-selected={board === b.id} className={clsx('gr-tab', board === b.id && 'is-active')} onClick={() => setBoard(b.id)}>
              {b.label}
            </button>
          ))}
        </div>
        <span className="gr-board__count">{data ? `${data.players} player${data.players === 1 ? '' : 's'}` : ''}</span>
      </div>

      {isLoading ? (
        <div className="gr-board__empty">Loading…</div>
      ) : error ? (
        <div className="gr-board__empty">The leaderboard is waking up — try again in a moment.</div>
      ) : !entries.length ? (
        <div className="gr-board__empty">
          <Trophy size={22} aria-hidden="true" />
          <span>{board === 'streaks' ? 'No streaks yet.' : 'Nobody has played yet — be the first!'}</span>
        </div>
      ) : (
        <ol className="gr-board__list">
          {entries.map((e) => {
            const Icon = RANK_ICON[e.rank];
            const v = value(board, e);
            return (
              <li key={`${e.rank}-${e.name}`} className={clsx('gr-row', e.you && 'is-you', e.rank <= 3 && `is-top${e.rank}`)}>
                <span className="gr-row__rank">{Icon ? <Icon size={16} aria-label={`Rank ${e.rank}`} /> : e.rank}</span>
                <span className="gr-row__name">
                  {e.name}
                  {e.signedIn && <BadgeCheck size={14} className="gr-row__verified" aria-label="Signed in" />}
                  {e.you && <span className="gr-row__you">You</span>}
                </span>
                <span className="gr-row__value">
                  <strong>
                    {board === 'streaks' && <Flame size={13} aria-hidden="true" />} {v.main}
                  </strong>
                  <span>{v.sub}</span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {you && !youVisible && (
        <p className="gr-board__you">
          You’re <strong>#{you.rank}</strong> of {data.players}.
        </p>
      )}

      <div className="gr-board__foot">
        {!account && (
          <button type="button" className="gr-link" onClick={() => openAuth('Sign in to appear on the leaderboard with your name.')}>
            Sign in to show your name
          </button>
        )}
        {compact && (
          <Link to="/leaderboard" className="gr-link">
            Full leaderboard →
          </Link>
        )}
      </div>
    </div>
  );
}
