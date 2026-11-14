import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight, Check, Flame, Lock, RotateCcw, X } from 'lucide-react';
import { Badge, Button, Card, Container, Section, SectionHeader, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import { ROADMAP_REGISTRY, roadmapProgress } from '@/features/roadmap/data/roadmapRegistry';
import { useProgressState, useProgressSummary } from '../hooks/useProgress';
import { ACHIEVEMENTS } from '../lib/achievements';
import { challengeNumber, formatDuration, todayKey } from '../lib/dates';
import { resetProgress } from '../lib/store';
import ActivityHeatmap from '../components/ActivityHeatmap';
import '../engagement.css';

function StreakHero({ summary }) {
  const { streak, level, totalXp } = summary;
  const message = streak.activeToday
    ? 'Today is done. Come back tomorrow to keep the flame going.'
    : streak.atRisk
      ? 'Your streak is at risk. One learning action today keeps it alive.'
      : 'Do one learning action today to start a streak.';

  return (
    <Card className="eg-streak-card" padding="lg">
      <div className={clsx('eg-flame', streak.activeToday && 'is-lit')} aria-hidden="true">
        <Flame size={44} />
      </div>
      <div className="eg-streak-card__main">
        <p className="eg-streak-card__num">
          {streak.current}
          <span> day{streak.current === 1 ? '' : 's'}</span>
        </p>
        <p className="eg-streak-card__msg">{message}</p>
        {!streak.activeToday && (
          <Button to="/daily" size="sm" iconEnd={<ArrowRight size={14} />}>
            Play today’s puzzle
          </Button>
        )}
      </div>
      <dl className="eg-streak-card__stats">
        <div>
          <dt>Longest</dt>
          <dd>{streak.longest}</dd>
        </div>
        <div>
          <dt>Active days</dt>
          <dd>{streak.totalDays}</dd>
        </div>
        <div>
          <dt>Total XP</dt>
          <dd>{totalXp.toLocaleString()}</dd>
        </div>
      </dl>
      <div className="eg-level">
        <div className="eg-level__top">
          <span>Level {level.level}</span>
          <span className="ds-meta">
            {level.into}/{level.span} XP to level {level.level + 1}
          </span>
        </div>
        <div className="eg-meter">
          <span style={{ '--p': `${Math.round(level.progress * 100)}%` }} />
        </div>
      </div>
    </Card>
  );
}

function RecentChallenges({ challenges }) {
  const today = challengeNumber(todayKey());
  const rows = Array.from({ length: 7 }, (_, i) => today - i).filter((n) => n >= 1);

  return (
    <Card padding="md" className="eg-history">
      <div className="eg-history__head">
        <h3>Daily Challenge, last 7 days</h3>
        <Link to="/daily" className="eg-link">
          Today’s puzzle <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <ul>
        {rows.map((n) => {
          const c = challenges[n];
          return (
            <li key={n}>
              <span className="eg-history__n">#{n}</span>
              {c ? (
                <>
                  <span className="eg-history__squares">
                    {c.answers.map((a, i) => (
                      <span key={i} className={clsx('eg-sq', a ? 'is-right' : 'is-wrong')}>
                        {a ? <Check size={11} /> : <X size={11} />}
                      </span>
                    ))}
                  </span>
                  <span className="ds-meta">
                    {c.score}/3 · {formatDuration(c.durationMs)}
                  </span>
                </>
              ) : (
                <span className="ds-meta">{n === today ? 'Not played yet' : 'Missed'}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default function ProgressPage() {
  const state = useProgressState();
  const summary = useProgressSummary();

  useDocumentMeta({
    title: 'Your progress — streaks, XP and achievements | Chaitanya Tech World',
    description: 'Your learning streak, activity calendar, roadmap progress and achievements.',
    robots: 'noindex, follow',
  });

  const onReset = () => {
    if (window.confirm('Reset all progress on this device? Streaks, XP, roadmap ticks and achievements will be cleared.')) {
      resetProgress();
    }
  };

  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length;

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Progress' }]}
        eyebrow="Your learning"
        title={
          <>
            Show up daily. <span className="ds-gradient-text">Watch it compound.</span>
          </>
        }
        description="Every daily puzzle, roadmap topic and visualiser run counts towards your streak. Progress is saved privately in this browser, and no account is needed."
      />

      <Section compact>
        <Container>
          <div className="eg-progress-grid">
            <StreakHero summary={summary} />
            <RecentChallenges challenges={state.challenges} />
          </div>
        </Container>
      </Section>

      <Section bordered compact>
        <Container>
          <SectionHeader eyebrow="Consistency" title="Activity" description="One square per day. Darker means more XP earned." />
          <Card padding="md">
            <ActivityHeatmap days={state.days} weeks={26} />
          </Card>
        </Container>
      </Section>

      <Section bordered compact>
        <Container>
          <SectionHeader eyebrow="Roadmaps" title="Where you are" />
          <div className="eg-roadmaps">
            {Object.values(ROADMAP_REGISTRY).map((rm) => {
              const p = roadmapProgress(rm, state.roadmaps[rm.id]);
              return (
                <Card key={rm.id} as={Link} to={`/roadmap/${rm.id}`} interactive padding="md" className="eg-roadmap">
                  <div className="eg-roadmap__top">
                    <h3>{rm.title}</h3>
                    <span className="eg-roadmap__pct">{p.percent}%</span>
                  </div>
                  <div className="eg-meter">
                    <span style={{ '--p': `${p.percent}%` }} />
                  </div>
                  <p className="ds-meta">
                    {p.done}/{p.total} topics{p.next ? ` · next: ${p.next.name}` : ' · complete!'}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section bordered compact>
        <Container>
          <SectionHeader
            eyebrow="Achievements"
            title={`${unlocked} of ${ACHIEVEMENTS.length} unlocked`}
            actions={
              <Button variant="ghost" size="sm" onClick={onReset} iconStart={<RotateCcw size={14} />}>
                Reset progress
              </Button>
            }
          />
          <ul className="eg-badges">
            {ACHIEVEMENTS.map((a) => {
              const at = state.achievements[a.id];
              return (
                <li key={a.id} className={clsx('eg-badge', at ? 'is-unlocked' : 'is-locked')}>
                  <span className="eg-badge__icon" aria-hidden="true">
                    {at ? a.icon : <Lock size={18} />}
                  </span>
                  <span className="eg-badge__text">
                    <strong>{a.title}</strong>
                    <span>{a.text}</span>
                  </span>
                  {at && <Badge tone="success">{new Date(at).toLocaleDateString()}</Badge>}
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
    </>
  );
}
