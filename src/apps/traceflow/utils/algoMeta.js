/** Presentation helpers shared by the Traceflow pages. */

export const DIFFICULTY_ORDER = { beginner: 0, intermediate: 1, advanced: 2 };

export const DIFFICULTY_TONE = { beginner: 'success', intermediate: 'warning', advanced: 'danger' };

// Rough growth order used to sort by complexity.
const COMPLEXITY_RANK = [
  'O(1)',
  'O(log log n)',
  'O(log₃ n)',
  'O(log n)',
  'O(√n)',
  'O(n)',
  'O(n log n)',
  'O(n^1.5)',
  'O(n²)',
];

export function complexityRank(value) {
  const i = COMPLEXITY_RANK.indexOf(value);
  return i === -1 ? COMPLEXITY_RANK.length : i;
}

export const visualizerPath = (slug) => `/traceflow/visualizer/${slug}`;
export const detailPath = (slug) => `/traceflow/algorithm/${slug}`;

/** Ways each algorithm is explained — used on the landing page and detail page. */
export const LEARNING_MODES = [
  { icon: 'message', title: 'Step-by-step narration', text: 'Every comparison, swap and pointer move is explained in plain English — with the “why”.' },
  { icon: 'code', title: 'Synced Java code', text: 'The exact line being executed is highlighted as the animation runs.' },
  { icon: 'list', title: 'Pseudocode', text: 'A language-neutral outline that captures the idea without syntax.' },
  { icon: 'history', title: 'Trace log', text: 'A full, clickable history of every step — jump anywhere in the run.' },
  { icon: 'gauge', title: 'Live variables & metrics', text: 'Pointers, comparisons, swaps, reads and writes update in real time.' },
  { icon: 'scale', title: 'Complexity & trade-offs', text: 'Best, average and worst cases, pros and cons, and real-world uses.' },
];
