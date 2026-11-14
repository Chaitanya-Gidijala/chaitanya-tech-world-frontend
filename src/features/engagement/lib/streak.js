import { addDays, daysBetween, todayKey } from './dates';

/**
 * Streak maths over the set of "active" days (days with at least one learning action).
 *
 *   current   consecutive active days ending today — or ending yesterday, in which case
 *             the streak is still alive but `atRisk` (do something today to keep it)
 *   longest   best run ever
 */
export function computeStreak(activeDays, today = todayKey()) {
  const set = activeDays instanceof Set ? activeDays : new Set(activeDays);
  const activeToday = set.has(today);
  const yesterday = addDays(today, -1);

  let current = 0;
  let cursor = activeToday ? today : set.has(yesterday) ? yesterday : null;
  while (cursor && set.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...set].sort();
  let longest = 0;
  let run = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && daysBetween(sorted[i - 1], sorted[i]) === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  return {
    current,
    longest: Math.max(longest, current),
    activeToday,
    atRisk: !activeToday && current > 0,
    totalDays: set.size,
  };
}
