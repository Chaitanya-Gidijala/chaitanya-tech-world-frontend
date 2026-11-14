/**
 * Achievement catalogue. `test(summary)` receives the derived progress summary
 * (see summarize() in store.js) and returns true once the badge is earned.
 * `celebrate` badges fire confetti in addition to the toast.
 */
export const ACHIEVEMENTS = [
  { id: 'first-step', icon: '🌱', title: 'First step', text: 'Complete your first learning action.', test: (s) => s.totalXp > 0 },
  { id: 'streak-3', icon: '🔥', title: 'Warming up', text: 'Reach a 3-day streak.', test: (s) => s.streak.longest >= 3 },
  { id: 'streak-7', icon: '⚡', title: 'One week strong', text: 'Reach a 7-day streak.', test: (s) => s.streak.longest >= 7, celebrate: true },
  { id: 'streak-30', icon: '🏆', title: 'Unstoppable', text: 'Reach a 30-day streak.', test: (s) => s.streak.longest >= 30, celebrate: true },
  { id: 'streak-100', icon: '💎', title: 'Centurion', text: 'Reach a 100-day streak.', test: (s) => s.streak.longest >= 100, celebrate: true },
  { id: 'daily-first', icon: '🧩', title: 'Puzzle solver', text: 'Finish your first Daily Challenge.', test: (s) => s.challengesPlayed >= 1 },
  { id: 'daily-perfect', icon: '🎯', title: 'Flawless', text: 'Score 3/3 on a Daily Challenge.', test: (s) => s.perfectChallenges >= 1, celebrate: true },
  { id: 'daily-10', icon: '🧠', title: 'Regular', text: 'Finish 10 Daily Challenges.', test: (s) => s.challengesPlayed >= 10 },
  { id: 'topics-10', icon: '📗', title: 'Bookworm', text: 'Complete 10 roadmap topics.', test: (s) => s.topicsDone >= 10 },
  { id: 'topics-50', icon: '📚', title: 'Scholar', text: 'Complete 50 roadmap topics.', test: (s) => s.topicsDone >= 50, celebrate: true },
  { id: 'explorer-5', icon: '🔭', title: 'Explorer', text: 'Run 5 different algorithms in the visualiser.', test: (s) => s.algorithmsExplored >= 5 },
  { id: 'xp-500', icon: '⭐', title: 'Rising star', text: 'Earn 500 XP.', test: (s) => s.totalXp >= 500 },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

/** XP awarded per action. */
export const XP = {
  challengeCorrect: 10,
  challengeFinish: 10,
  topic: 5,
  visualize: 2,
};

/** Level curve: level n needs 100·n·(n+1)/2 XP in total (100, 300, 600 …). */
export function levelFor(xp) {
  let level = 1;
  while (xp >= (100 * level * (level + 1)) / 2) level++;
  const floor = (100 * (level - 1) * level) / 2;
  const ceil = (100 * level * (level + 1)) / 2;
  return { level, into: xp - floor, span: ceil - floor, progress: (xp - floor) / (ceil - floor) };
}
