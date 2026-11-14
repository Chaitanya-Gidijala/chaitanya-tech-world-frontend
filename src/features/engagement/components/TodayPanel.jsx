import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Check, Flame, Map as MapIcon, Puzzle, X } from 'lucide-react';
import { Button, Container } from '@/design-system';
import { ROADMAP_REGISTRY, roadmapProgress } from '@/features/roadmap/data/roadmapRegistry';
import { useNow, useToday } from '../hooks/useNow';
import { useProgressState, useProgressSummary } from '../hooks/useProgress';
import { challengeNumber, formatCountdown, msUntilMidnight } from '../lib/dates';
import { fetchDailyStats } from '../api/engagementApi';
import '../engagement.css';

/** Most recently touched roadmap, falling back to Java. */
function continueRoadmap(state) {
  let best = null;
  for (const rm of Object.values(ROADMAP_REGISTRY)) {
    const map = state.roadmaps[rm.id] ?? {};
    const last = Object.values(map).sort().at(-1) ?? '';
    if (!best || last > best.last) best = { rm, last };
  }
  const rm = best?.rm ?? ROADMAP_REGISTRY.java;
  return { rm, progress: roadmapProgress(rm, state.roadmaps[rm.id]) };
}

/**
 * TodayPanel — the personal "daily dashboard" strip on the home page:
 * streak, today's puzzle (with live player count) and where to continue.
 */
export default function TodayPanel() {
  const today = useToday();
  const now = useNow(1000);
  const number = challengeNumber(today);
  const state = useProgressState();
  const { streak, level } = useProgressSummary();
  const played = state.challenges[number];
  const { rm, progress } = continueRoadmap(state);

  const { data: stats } = useQuery({
    queryKey: ['daily-stats', number],
    queryFn: () => fetchDailyStats(number),
    refetchInterval: 60_000,
    retry: false,
    staleTime: 30_000,
  });

  const streakMsg = streak.activeToday
    ? 'Done for today — nice.'
    : streak.atRisk
      ? 'At risk! Learn something today.'
      : 'Start a streak today.';

  return (
    <section className="eg-today" aria-labelledby="eg-today-title">
      <Container>
        <h2 id="eg-today-title" className="ds-visually-hidden">
          Today
        </h2>
        <div className="eg-today__grid">
          <Link to="/progress" className={clsx('eg-today__card eg-today__streak', streak.atRisk && 'is-at-risk')}>
            <span className={clsx('eg-flame eg-flame--sm', streak.activeToday && 'is-lit')} aria-hidden="true">
              <Flame size={26} />
            </span>
            <span className="eg-today__body">
              <span className="eg-today__label">Your streak · Level {level.level}</span>
              <span className="eg-today__value">
                {streak.current} day{streak.current === 1 ? '' : 's'}
              </span>
              <span className="eg-today__sub">{streakMsg}</span>
            </span>
          </Link>

          <div className="eg-today__card eg-today__daily">
            <span className="eg-today__icon" aria-hidden="true">
              <Puzzle size={22} />
            </span>
            <span className="eg-today__body">
              <span className="eg-today__label">
                Traceflow Daily #{number}
                {stats?.liveNow > 0 && (
                  <span className="eg-today__live">
                    <span className="eg-dot" aria-hidden="true" /> {stats.liveNow} playing
                  </span>
                )}
              </span>
              {played ? (
                <>
                  <span className="eg-today__value eg-today__squares">
                    {played.answers.map((a, i) => (
                      <span key={i} className={clsx('eg-sq', a ? 'is-right' : 'is-wrong')}>
                        {a ? <Check size={11} /> : <X size={11} />}
                      </span>
                    ))}
                    <span>{played.score}/3</span>
                  </span>
                  <span className="eg-today__sub">
                    Next puzzle in <span className="eg-mono">{formatCountdown(msUntilMidnight(now))}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="eg-today__value">3 rounds · ~2 min</span>
                  <span className="eg-today__sub">
                    {stats?.completions ? `${stats.completions.toLocaleString()} solved today` : 'Same puzzle for everyone today'}
                  </span>
                </>
              )}
            </span>
            <Button to="/daily" size="sm" variant={played ? 'secondary' : 'primary'} iconEnd={<ArrowRight size={14} />}>
              {played ? 'Results' : 'Play'}
            </Button>
          </div>

          <Link to={`/roadmap/${rm.id}`} className="eg-today__card eg-today__roadmap">
            <span className="eg-today__icon" aria-hidden="true">
              <MapIcon size={22} />
            </span>
            <span className="eg-today__body">
              <span className="eg-today__label">Continue: {rm.title}</span>
              <span className="eg-today__value">{progress.percent}% complete</span>
              <span className="eg-today__sub">{progress.next ? `Next: ${progress.next.name}` : 'Roadmap complete!'}</span>
              <span className="eg-meter eg-meter--thin">
                <span style={{ '--p': `${progress.percent}%` }} />
              </span>
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
