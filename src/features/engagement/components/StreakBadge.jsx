import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Flame } from 'lucide-react';
import { useProgressSummary } from '../hooks/useProgress';
import '../engagement.css';

/** Header pill: 🔥 current streak → /progress. Dimmed when today isn't done yet. */
export default function StreakBadge({ className, onClick }) {
  const { streak, level } = useProgressSummary();
  const label = streak.current
    ? `${streak.current}-day streak${streak.atRisk ? ', learn something today to keep it' : ''}. Level ${level.level}.`
    : 'Start a learning streak';

  return (
    <Link
      to="/progress"
      onClick={onClick}
      className={clsx('eg-streak-badge', streak.activeToday && 'is-lit', streak.atRisk && 'is-at-risk', className)}
      aria-label={label}
      title={label}
    >
      <Flame size={15} aria-hidden="true" />
      <span className="eg-streak-badge__count">{streak.current}</span>
    </Link>
  );
}
