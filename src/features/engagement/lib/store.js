import { ACHIEVEMENTS, XP, levelFor } from './achievements';
import { computeStreak } from './streak';
import { todayKey } from './dates';

/**
 * Learner progress store — local-first.
 *
 * All progress lives in localStorage so it is instant, works offline and needs
 * no account. Tabs stay in sync through the `storage` event, and components
 * read it with useSyncExternalStore (see hooks/useProgress.js).
 *
 * Shape (v1):
 *   learnerId     anonymous UUID — used to de-duplicate daily-challenge results server-side
 *   days          { [dayKey]: { xp, actions: { challenge, topic, visualize } } }
 *   roadmaps      { [roadmapId]: { [topicKey]: dayKey } }      completed topics
 *   topicXp       { [roadmapId::topicKey]: true }              topics that already paid out XP
 *   challenges    { [challengeNo]: { score, answers, durationMs, completedAt, dayKey } }
 *   visualized    { [algoSlug]: dayKey }                       last day each algorithm was run
 *   achievements  { [id]: ISO timestamp }
 */

const STORAGE_KEY = 'ctw-progress-v1';
const VERSION = 1;

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function emptyState() {
  return {
    v: VERSION,
    learnerId: uuid(),
    createdAt: new Date().toISOString(),
    days: {},
    roadmaps: {},
    topicXp: {},
    challenges: {},
    visualized: {},
    achievements: {},
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== VERSION) return { ...emptyState(), ...parsed, v: VERSION };
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

let state = typeof window === 'undefined' ? emptyState() : load();
let summaryCache = null;
const listeners = new Set();
const achievementListeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full / private mode — keep working in memory */
  }
}

function emit() {
  summaryCache = null;
  listeners.forEach((l) => l());
}

/** Apply a mutation, award achievements, persist and notify. */
function update(mutator) {
  const next = structuredClone(state);
  mutator(next);
  state = next;

  const summary = summarize(state);
  const unlocked = ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && a.test(summary));
  if (unlocked.length) {
    const at = new Date().toISOString();
    unlocked.forEach((a) => {
      state.achievements[a.id] = at;
    });
  }

  persist();
  emit();
  unlocked.forEach((a) => achievementListeners.forEach((l) => l(a)));
}

function addXp(s, kind, amount, day = todayKey()) {
  const d = (s.days[day] ??= { xp: 0, actions: {} });
  d.xp += amount;
  d.actions[kind] = (d.actions[kind] ?? 0) + 1;
}

// Cross-tab sync: another tab wrote progress → reload and re-render.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    state = load();
    emit();
  });
}

/* ── Public API ─────────────────────────────────────────────────────────── */

export const progressStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getState: () => state,
  getSummary() {
    if (!summaryCache) summaryCache = summarize(state);
    return summaryCache;
  },
  onAchievement(listener) {
    achievementListeners.add(listener);
    return () => achievementListeners.delete(listener);
  },
};

export const getLearnerId = () => state.learnerId;

/** Mark a roadmap topic done / not done. XP is paid once per topic. */
export function setTopicDone(roadmapId, topicKey, done) {
  update((s) => {
    const map = (s.roadmaps[roadmapId] ??= {});
    if (done) {
      map[topicKey] = todayKey();
      const xpKey = `${roadmapId}::${topicKey}`;
      if (!s.topicXp[xpKey]) {
        s.topicXp[xpKey] = true;
        addXp(s, 'topic', XP.topic);
      }
    } else {
      delete map[topicKey];
    }
  });
}

/** Record a finished daily challenge (ignored if this puzzle was already completed). */
export function recordChallenge(challengeNo, { answers, durationMs }) {
  if (state.challenges[challengeNo]) return false;
  const score = answers.filter(Boolean).length;
  update((s) => {
    s.challenges[challengeNo] = {
      score,
      answers: answers.map((a) => (a ? 1 : 0)),
      durationMs,
      completedAt: new Date().toISOString(),
      dayKey: todayKey(),
    };
    addXp(s, 'challenge', XP.challengeFinish + score * XP.challengeCorrect);
  });
  return true;
}

/** Remember the server-side ranking for a finished puzzle ({ rank, total, percentile }). */
export function setChallengeStanding(challengeNo, standing) {
  if (!state.challenges[challengeNo]) return;
  update((s) => {
    s.challenges[challengeNo].standing = standing;
  });
}

/** A visualiser run — counts towards the streak once per algorithm per day. */
export function recordVisualize(slug) {
  const today = todayKey();
  if (state.visualized[slug] === today) return;
  update((s) => {
    s.visualized[slug] = today;
    addXp(s, 'visualize', XP.visualize);
  });
}

export function resetProgress() {
  const learnerId = state.learnerId; // keep the id so server-side results stay de-duplicated
  state = { ...emptyState(), learnerId };
  persist();
  emit();
}

/* ── Derived data ───────────────────────────────────────────────────────── */

export function summarize(s) {
  const activeDays = Object.keys(s.days).filter((k) => s.days[k].xp > 0);
  const totalXp = activeDays.reduce((sum, k) => sum + s.days[k].xp, 0);
  const challenges = Object.values(s.challenges);
  const topicsDone = Object.values(s.roadmaps).reduce((sum, m) => sum + Object.keys(m).length, 0);

  return {
    streak: computeStreak(activeDays),
    totalXp,
    level: levelFor(totalXp),
    activeDays,
    challengesPlayed: challenges.length,
    perfectChallenges: challenges.filter((c) => c.score === 3).length,
    topicsDone,
    algorithmsExplored: Object.keys(s.visualized).length,
  };
}
