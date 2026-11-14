/** Confetti burst (lazy-loaded, skipped for reduced motion). */
export async function celebrate() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const { default: confetti } = await import('canvas-confetti');
  confetti({ particleCount: 140, spread: 75, origin: { y: 0.7 }, colors: ['#a78bfa', '#22d3ee', '#f472b6', '#facc15'] });
}
