import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Flame,
  Play,
  Share2,
  Timer,
  Trophy,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge, Button, Card, Container, Section, SectionHeader, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import { useNow, useToday } from '@/features/engagement/hooks/useNow';
import { useProgressState, useProgressSummary } from '@/features/engagement/hooks/useProgress';
import { recordChallenge, setChallengeStanding } from '@/features/engagement/lib/store';
import { challengeNumber, formatCountdown, formatDuration, msUntilMidnight } from '@/features/engagement/lib/dates';
import { submitDailyResult, useLiveDailyStats } from '@/features/engagement/api/engagementApi';
import { celebrate } from '@/features/engagement/lib/celebrate';
import { generateChallenge, verifyLink } from './lib/generateChallenge';
import { downloadShareCard, formatStanding, shareResult, shareText } from './lib/share';
import ArrayTiles from './components/ArrayTiles';
import LiveStats, { LiveIndicator } from './components/LiveStats';
import './daily.css';

const RUN_KEY = 'ctw-daily-run';

/* ── In-progress run (survives reloads, so answers can't be re-rolled) ──── */

function loadRun(number) {
  try {
    const run = JSON.parse(localStorage.getItem(RUN_KEY));
    if (run?.number === number) return run;
  } catch {
    /* ignore */
  }
  return null;
}

function saveRun(run) {
  try {
    if (run) localStorage.setItem(RUN_KEY, JSON.stringify(run));
    else localStorage.removeItem(RUN_KEY);
  } catch {
    /* ignore */
  }
}

/* ── Pieces ─────────────────────────────────────────────────────────────── */

function Countdown() {
  const now = useNow(1000);
  return <span className="dc-countdown">{formatCountdown(msUntilMidnight(now))}</span>;
}

function Elapsed({ startedAt }) {
  const now = useNow(1000);
  return (
    <span className="dc-elapsed">
      <Timer size={14} aria-hidden="true" /> {formatDuration(now.getTime() - startedAt)}
    </span>
  );
}

function ProgressDots({ picks, rounds, current }) {
  return (
    <ol className="dc-dots" aria-label="Rounds">
      {rounds.map((r, i) => {
        const pick = picks[i];
        const state = pick == null ? (i === current ? 'current' : 'todo') : pick === r.correctIndex ? 'right' : 'wrong';
        return (
          <li key={r.id} className={`dc-dots__dot is-${state}`}>
            <span className="ds-visually-hidden">
              Round {i + 1}: {state}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OptionButton({ round, option, index, pick, onPick }) {
  const answered = pick != null;
  const isCorrect = index === round.correctIndex;
  const isPicked = index === pick;
  const state = !answered ? 'idle' : isCorrect ? 'correct' : isPicked ? 'wrong' : 'dim';

  return (
    <button
      type="button"
      className={clsx('dc-option', `is-${state}`, round.kind === 'number' && 'dc-option--number')}
      onClick={() => onPick(index)}
      disabled={answered}
      aria-pressed={isPicked}
    >
      <kbd className="dc-option__key" aria-hidden="true">
        {index + 1}
      </kbd>
      {round.kind === 'array' ? (
        <ArrayTiles values={option} size="sm" />
      ) : (
        <span className="dc-option__number">{option}</span>
      )}
      {answered && (isCorrect || isPicked) && (
        <span className="dc-option__mark" aria-label={isCorrect ? 'Correct answer' : 'Your answer'}>
          {isCorrect ? <Check size={16} /> : <X size={16} />}
        </span>
      )}
    </button>
  );
}

function RoundView({ round, index, total, pick, onPick, onNext }) {
  const answered = pick != null;
  const correct = pick === round.correctIndex;

  return (
    <motion.div
      key={round.id}
      className="dc-round"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dc-round__head">
        <Badge tone="accent">
          Round {index + 1}/{total} · {round.kicker}
        </Badge>
        <Badge>{round.algorithm.name}</Badge>
      </div>

      <h2 className="dc-round__prompt">{round.prompt}</h2>

      <div className="dc-round__input">
        <span className="ds-meta">Input{round.target != null ? ` · target ${round.target}` : ''}</span>
        <ArrayTiles values={round.input} highlight={round.target} />
      </div>

      <p className="dc-round__hint">{round.hint}</p>

      <div className={clsx('dc-options', round.kind === 'number' && 'dc-options--numbers')} role="group" aria-label="Answers">
        {round.options.map((opt, i) => (
          <OptionButton key={String(opt)} round={round} option={opt} index={i} pick={pick} onPick={onPick} />
        ))}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            className={clsx('dc-feedback', correct ? 'is-correct' : 'is-wrong')}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
          >
            <div>
              <strong>{correct ? 'Correct!' : 'Not quite.'}</strong> {round.explain}
            </div>
            <div className="dc-feedback__actions">
              <Button
                href={verifyLink(round.verify)}
                target="_blank"
                rel="noopener"
                variant="ghost"
                size="sm"
                iconEnd={<ExternalLink size={14} />}
              >
                Step through it
              </Button>
              <Button onClick={onNext} size="sm" iconEnd={<ArrowRight size={14} />} autoFocus>
                {index + 1 === total ? 'See results' : 'Next round'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResultView({ challenge, result, summary, stats, status, standing }) {
  const answers = result.answers.map(Boolean);
  const shareData = {
    number: challenge.number,
    answers,
    durationMs: result.durationMs,
    streak: summary.streak.current,
    standing,
  };

  const onShare = async () => {
    try {
      const outcome = await shareResult(shareData);
      if (outcome === 'copied') toast.success('Result copied — paste it anywhere.');
    } catch {
      toast.error('Sharing is not available in this browser.');
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText(shareData));
      toast.success('Result copied to clipboard.');
    } catch {
      toast.error('Could not access the clipboard.');
    }
  };

  return (
    <div className="dc-result">
      <Card className="dc-result__card" padding="lg">
        <p className="ds-eyebrow">
          <Trophy size={14} aria-hidden="true" /> Daily #{challenge.number} complete
        </p>
        <div className="dc-result__score">
          <span className="dc-result__big">{result.score}/3</span>
          <div className="dc-result__squares" aria-label={`${result.score} of 3 correct`}>
            {answers.map((ok, i) => (
              <motion.span
                key={i}
                className={clsx('dc-square', ok ? 'is-right' : 'is-wrong')}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 400, damping: 18 }}
              >
                {ok ? <Check size={20} /> : <X size={20} />}
              </motion.span>
            ))}
          </div>
        </div>

        <dl className="dc-result__meta">
          <div>
            <dt>Time</dt>
            <dd>{formatDuration(result.durationMs)}</dd>
          </div>
          <div>
            <dt>Streak</dt>
            <dd>
              <Flame size={16} aria-hidden="true" /> {summary.streak.current}
            </dd>
          </div>
          <div>
            <dt>Ranking</dt>
            <dd>{formatStanding(standing) ?? '—'}</dd>
          </div>
        </dl>

        <div className="dc-result__share">
          <Button onClick={onShare} iconStart={<Share2 size={15} />}>
            Share result
          </Button>
          <Button onClick={onCopy} variant="secondary" iconStart={<Copy size={15} />}>
            Copy
          </Button>
          <Button onClick={() => downloadShareCard(shareData)} variant="secondary" iconStart={<Download size={15} />}>
            Image
          </Button>
        </div>

        <p className="dc-result__next">
          Next puzzle in <Countdown />
        </p>
      </Card>

      <LiveStats stats={stats} status={status} myScore={result.score} />

      <Card className="dc-review" padding="md">
        <h3 className="dc-review__title">Review today’s rounds</h3>
        <ul>
          {challenge.rounds.map((r, i) => (
            <li key={r.id}>
              <span className={clsx('dc-square dc-square--sm', answers[i] ? 'is-right' : 'is-wrong')}>
                {answers[i] ? <Check size={12} /> : <X size={12} />}
              </span>
              <span className="dc-review__text">
                <strong>{r.kicker}</strong> — {r.explain}
              </span>
              <Link to={verifyLink(r.verify)} className="dc-review__link">
                Replay <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

/** Route entry — keyed by puzzle number so a new day starts from a clean slate. */
export default function DailyChallengePage() {
  const today = useToday();
  const number = challengeNumber(today);
  return <DailyChallenge key={number} number={number} />;
}

function DailyChallenge({ number }) {
  const challenge = useMemo(() => generateChallenge(number), [number]);
  const progress = useProgressState();
  const summary = useProgressSummary();
  const result = progress.challenges[number];

  const [run, setRun] = useState(() => loadRun(number));
  const [standing, setStanding] = useState(null);
  const { stats, status, setStats } = useLiveDailyStats(number);
  const submitted = useRef(false);

  useDocumentMeta({
    title: `Traceflow Daily #${number} — Algorithm puzzle of the day | Chaitanya Tech World`,
    description:
      'A new 3-round algorithm puzzle every day. Predict the next swap, fast-forward a sort and count binary-search steps — then share your score and keep your streak alive.',
  });

  const persistRun = useCallback((next) => {
    setRun(next);
    saveRun(next);
  }, []);

  const start = () => persistRun({ number, startedAt: Date.now(), current: 0, picks: [null, null, null] });

  const finish = useCallback(
    (finalRun) => {
      const answers = challenge.rounds.map((r, i) => finalRun.picks[i] === r.correctIndex);
      const durationMs = Math.min(Date.now() - finalRun.startedAt, 3_600_000);
      const isNew = recordChallenge(number, { answers, durationMs });
      saveRun(null);
      setRun(null);
      if (answers.every(Boolean)) celebrate();

      if (isNew && !submitted.current) {
        submitted.current = true;
        submitDailyResult(number, { answers, durationMs })
          .then((res) => {
            if (res?.stats) setStats(res.stats);
            if (res?.rank) {
              const next = { rank: res.rank, total: res.stats?.completions ?? res.rank, percentile: res.percentile };
              setStanding(next);
              setChallengeStanding(number, next);
            }
          })
          .catch(() => {});
      }
    },
    [challenge, number, setStats],
  );

  const onPick = useCallback(
    (optionIndex) => {
      if (!run || run.picks[run.current] != null) return;
      const picks = [...run.picks];
      picks[run.current] = optionIndex;
      persistRun({ ...run, picks });
    },
    [run, persistRun],
  );

  const onNext = useCallback(() => {
    if (!run) return;
    if (run.current + 1 >= challenge.rounds.length) finish(run);
    else persistRun({ ...run, current: run.current + 1 });
  }, [run, challenge, finish, persistRun]);

  // Keyboard: 1–4 answer, Enter → next.
  useEffect(() => {
    if (!run) return undefined;
    const onKey = (e) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, [contenteditable="true"]')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) onPick(n - 1);
      else if (e.key === 'Enter' && run.picks[run.current] != null && !(e.target instanceof HTMLButtonElement)) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run, onPick, onNext]);

  const phase = result ? 'done' : run ? 'playing' : 'intro';
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <PageHero
        className="dc-hero"
        breadcrumbs={[{ label: 'Traceflow', to: '/traceflow' }, { label: `Daily #${number}` }]}
        meta={
          <>
            <Badge tone="accent" dot>
              Daily #{number}
            </Badge>
            <Badge>{dateLabel}</Badge>
            <LiveIndicator status={status} liveNow={stats?.liveNow} />
          </>
        }
        title={
          <>
            Traceflow <span className="ds-gradient-text">Daily</span>
          </>
        }
        description="Three algorithm puzzles, one shot each. Everyone in the world gets the same rounds today. Solve them, share your squares, keep your streak burning."
        stats={[
          { label: 'Day streak', value: summary.streak.current },
          { label: 'Played', value: summary.challengesPlayed },
          { label: 'Players today', value: stats?.completions ?? '—' },
          { label: 'Level', value: summary.level.level },
        ]}
      />

      <Section compact>
        <Container size="narrow">
          {phase === 'intro' && (
            <Card className="dc-intro" padding="lg">
              <h2 className="dc-intro__title">Today’s puzzle</h2>
              <ol className="dc-intro__rounds">
                {challenge.rounds.map((r, i) => (
                  <li key={r.id}>
                    <span className="dc-intro__n">{i + 1}</span>
                    <span>
                      <strong>{r.kicker}</strong>
                      <span className="ds-meta"> · {r.algorithm.name}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="ds-meta">
                One attempt per round. The clock starts when you press start. Use keys <kbd>1</kbd>–<kbd>4</kbd> to answer.
              </p>
              <Button onClick={start} size="lg" iconStart={<Play size={16} />}>
                Start Daily #{number}
              </Button>
            </Card>
          )}

          {phase === 'playing' && (
            <Card className="dc-play" padding="lg">
              <div className="dc-play__bar">
                <ProgressDots picks={run.picks} rounds={challenge.rounds} current={run.current} />
                <Elapsed startedAt={run.startedAt} />
              </div>
              <AnimatePresence mode="wait">
                <RoundView
                  key={run.current}
                  round={challenge.rounds[run.current]}
                  index={run.current}
                  total={challenge.rounds.length}
                  pick={run.picks[run.current]}
                  onPick={onPick}
                  onNext={onNext}
                />
              </AnimatePresence>
            </Card>
          )}

          {phase === 'done' && (
            <ResultView
              challenge={challenge}
              result={result}
              summary={summary}
              stats={stats}
              status={status}
              standing={standing ?? result.standing}
            />
          )}

          {phase !== 'done' && (
            <div className="dc-side">
              <LiveStats stats={stats} status={status} />
            </div>
          )}
        </Container>
      </Section>

      <Section bordered compact>
        <Container>
          <SectionHeader
            eyebrow="While you wait"
            title="Keep the streak burning"
            description="Any learning action counts towards today: the daily puzzle, a roadmap topic, or an algorithm run in the visualiser."
          />
          <div className="dc-next-grid">
            <Card as={Link} to="/progress" interactive padding="md">
              <h3>Your progress</h3>
              <p className="ds-meta">Streak calendar, XP, levels and achievements.</p>
            </Card>
            <Card as={Link} to="/roadmap/java" interactive padding="md">
              <h3>Java roadmap</h3>
              <p className="ds-meta">Tick off topics as you learn them — each one counts.</p>
            </Card>
            <Card as={Link} to="/traceflow/catalogue" interactive padding="md">
              <h3>Algorithm catalogue</h3>
              <p className="ds-meta">Run any of 15 algorithms step by step.</p>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
