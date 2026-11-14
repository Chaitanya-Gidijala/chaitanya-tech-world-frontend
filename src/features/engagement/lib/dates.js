/**
 * Calendar helpers for streaks and the daily challenge.
 *
 * Everything works on *local* calendar days ("YYYY-MM-DD") so a streak and the
 * daily puzzle roll over at the learner's own midnight — the same model Wordle uses.
 */

const DAY_MS = 86_400_000;

/** First daily challenge — puzzle #1. Never change this once live (it renumbers every puzzle). */
export const CHALLENGE_EPOCH = { year: 2026, month: 11, day: 14 };

const pad = (n) => String(n).padStart(2, '0');

/** "YYYY-MM-DD" for a Date in the local timezone. */
export function toDayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parse "YYYY-MM-DD" into a local-midnight Date. */
export function fromDayKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Shift a day key by `n` calendar days (DST-safe: works on calendar fields, not ms). */
export function addDays(key, n) {
  const d = fromDayKey(key);
  d.setDate(d.getDate() + n);
  return toDayKey(d);
}

/** Whole calendar days from `a` to `b` (positive when b is later). */
export function daysBetween(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / DAY_MS);
}

export const todayKey = () => toDayKey(new Date());

const EPOCH_KEY = `${CHALLENGE_EPOCH.year}-${pad(CHALLENGE_EPOCH.month)}-${pad(CHALLENGE_EPOCH.day)}`;

/** Daily challenge number for a local day ("#1" on the epoch). */
export function challengeNumber(dayKey = todayKey()) {
  return daysBetween(EPOCH_KEY, dayKey) + 1;
}

/** Milliseconds until the next local midnight. */
export function msUntilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** "1:05" / "12:40" style duration. */
export function formatDuration(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${pad(s)}`;
}

/** "05:12:09" countdown. */
export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
