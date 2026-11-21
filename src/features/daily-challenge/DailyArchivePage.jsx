import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight, Check, Play, X } from 'lucide-react';
import { Button, Container, Section, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import { useToday } from '@/features/engagement/hooks/useNow';
import { useProgressState } from '@/features/engagement/hooks/useProgress';
import { CHALLENGE_EPOCH, challengeNumber } from '@/features/engagement/lib/dates';
import NewsletterSignup from '@/features/growth/NewsletterSignup';
import { generateChallenge } from './lib/generateChallenge';
import './daily.css';

const PAGE = 30;

function puzzleDate(n) {
  const d = new Date(CHALLENGE_EPOCH.year, CHALLENGE_EPOCH.month - 1, CHALLENGE_EPOCH.day);
  d.setDate(d.getDate() + n - 1);
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/** /daily/archive — every past puzzle, playable as practice. */
export default function DailyArchivePage() {
  const today = challengeNumber(useToday());
  const progress = useProgressState();
  const [shown, setShown] = useState(PAGE);
  const latest = today - 1;

  useDocumentMeta({
    title: 'Traceflow Daily Archive — Past Algorithm Puzzles to Practise | Chaitanya Tech World',
    description: 'Every past Traceflow Daily puzzle: sorting swaps, fast-forward rounds and binary-search counts. Replay any of them as practice.',
  });

  const puzzles = useMemo(() => {
    const out = [];
    for (let n = latest; n >= 1 && out.length < shown; n--) {
      const c = generateChallenge(n);
      out.push({ n, algorithms: [...new Set(c.rounds.map((r) => r.algorithm.name))] });
    }
    return out;
  }, [latest, shown]);

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Traceflow Daily', to: '/daily' }, { label: 'Archive' }]}
        eyebrow="Practice"
        title={
          <>
            Past puzzles, <span className="ds-gradient-text">unlimited practice</span>
          </>
        }
        description="Replay any earlier Traceflow Daily. Practice runs don’t affect your streak or the leaderboard."
        actions={
          <Button to="/daily" size="lg" iconEnd={<ArrowRight size={16} />}>
            Today’s puzzle #{today}
          </Button>
        }
      />
      <Section compact>
        <Container size="narrow">
          {latest < 1 ? (
            <p className="ds-meta">The archive fills up from tomorrow — play today’s puzzle first.</p>
          ) : (
            <ul className="dc-archive">
              {puzzles.map((p) => {
                const mine = progress.challenges[p.n];
                return (
                  <li key={p.n}>
                    <Link to={`/daily/practice/${p.n}`} className="dc-archive__item">
                      <span className="dc-archive__n">#{p.n}</span>
                      <span className="dc-archive__body">
                        <strong>{puzzleDate(p.n)}</strong>
                        <span className="ds-meta">{p.algorithms.join(' · ')}</span>
                      </span>
                      {mine ? (
                        <span className="dc-archive__score" aria-label={`You scored ${mine.score} of 3`}>
                          {mine.answers.map((a, i) => (
                            <span key={i} className={clsx('dc-square dc-square--sm', a ? 'is-right' : 'is-wrong')}>
                              {a ? <Check size={11} /> : <X size={11} />}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="dc-archive__play">
                          <Play size={14} aria-hidden="true" /> Practise
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {shown < latest && (
            <div className="dc-archive__more">
              <Button variant="secondary" onClick={() => setShown((s) => s + PAGE)}>
                Show older puzzles
              </Button>
            </div>
          )}
          <NewsletterSignup source="archive" />
        </Container>
      </Section>
    </>
  );
}
