import { getAlgorithm } from '@/apps/traceflow/algorithms/index.js';

/**
 * Daily Challenge generator — deterministic per puzzle number, so everyone in
 * the world gets the same three rounds on the same day (and the answer can be
 * verified step-by-step in the Traceflow visualiser with the exact same input).
 *
 *   Round 1  "First move"    — predict the array after the first effective swap
 *   Round 2  "Fast forward"  — predict the array after the k-th swap (harder algorithm)
 *   Round 3  "Count it"      — how many midpoints Binary Search checks
 *
 * Answers come straight from the real Traceflow trace generators, never from a
 * hand-written answer key.
 */

// Algorithms whose moves are true swaps (no temporary duplicates mid-trace).
const EASY_POOL = ['bubble-sort', 'selection-sort', 'cocktail-sort', 'shell-sort'];
const HARD_POOL = ['quick-sort', 'heap-sort', 'comb-sort', 'shell-sort', 'cocktail-sort', 'selection-sort'];
const MOVE_TYPES = new Set(['SWAP', 'SHIFT']);

/* ── Seeded randomness ─────────────────────────────────────────────────── */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (rng, list) => list[Math.floor(rng() * list.length)];

function shuffle(rng, list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function distinctValues(rng, count, min = 3, max = 99) {
  const set = new Set();
  while (set.size < count) set.add(int(rng, min, max));
  return [...set];
}

const key = (arr) => arr.join(',');

/* ── Trace helpers ─────────────────────────────────────────────────────── */

/** Array snapshots after each *effective* move (a swap that actually changes the array). */
function moveStates(algo, input) {
  const trace = algo.traceGenerator(input);
  const states = [];
  let prev = key(input);
  for (const ev of trace) {
    if (!MOVE_TYPES.has(ev.type) || !ev.arrayState) continue;
    const k = key(ev.arrayState);
    if (k !== prev) {
      states.push([...ev.arrayState]);
      prev = k;
    }
  }
  return states;
}

/** Build 4 unique array options: the answer plus plausible distractors. */
function arrayOptions(rng, answer, candidates) {
  const seen = new Set([key(answer)]);
  const distractors = [];
  const add = (arr) => {
    const k = key(arr);
    if (!seen.has(k)) {
      seen.add(k);
      distractors.push(arr);
    }
  };

  shuffle(rng, candidates).forEach(add);

  // Near-misses: the answer with one adjacent pair swapped.
  let guard = 0;
  while (distractors.length < 6 && guard++ < 40) {
    const i = int(rng, 0, answer.length - 2);
    const near = [...answer];
    [near[i], near[i + 1]] = [near[i + 1], near[i]];
    add(near);
  }

  const options = shuffle(rng, [answer, ...shuffle(rng, distractors).slice(0, 3)]);
  return { options, correctIndex: options.findIndex((o) => key(o) === key(answer)) };
}

/* ── Rounds ────────────────────────────────────────────────────────────── */

function swapRound(rng, { pool, size, minMoves, nth, id, kicker }) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const slug = pick(rng, pool);
    const algo = getAlgorithm(slug);
    const input = distinctValues(rng, size);
    const states = moveStates(algo, input);
    if (states.length < minMoves) continue;

    const k = nth(states.length);
    const answer = states[k - 1];
    const candidates = [input, states[k - 2], states[k], states[k + 1], [...input].sort((a, b) => a - b)].filter(Boolean);
    const { options, correctIndex } = arrayOptions(rng, answer, candidates);

    return {
      id,
      kind: 'array',
      kicker,
      algorithm: { slug, name: algo.name },
      input,
      k,
      prompt:
        k === 1
          ? `${algo.name} runs on this array. What does it look like after the first swap?`
          : `${algo.name} runs on this array. What does it look like after ${k} swaps?`,
      hint: 'Only swaps that actually move values count.',
      options,
      correctIndex,
      explain: `After ${k === 1 ? 'the first swap' : `${k} swaps`}, ${algo.name} has produced [${answer.join(', ')}].`,
      verify: { slug, input, target: null },
    };
  }
  throw new Error('Could not generate a swap round');
}

function binarySearchRound(rng) {
  const algo = getAlgorithm('binary-search');
  const size = int(rng, 10, 15);
  const input = distinctValues(rng, size, 1, 99).sort((a, b) => a - b);
  const present = rng() < 0.7;
  let target;
  if (present) {
    target = pick(rng, input);
  } else {
    do target = int(rng, 1, 99);
    while (input.includes(target));
  }

  const trace = algo.traceGenerator(input, target);
  const answer = trace.filter((ev) => ev.type === 'POINTER_MOVE').length;

  const pool = new Set([answer]);
  for (const d of shuffle(rng, [-2, -1, 1, 2, 3])) {
    if (pool.size >= 4) break;
    if (answer + d >= 1) pool.add(answer + d);
  }
  const options = shuffle(rng, [...pool]);

  return {
    id: 'count',
    kind: 'number',
    kicker: 'Count it',
    algorithm: { slug: 'binary-search', name: algo.name },
    input,
    target,
    prompt: `Binary Search looks for ${target} in this sorted array. How many middle elements does it check before it stops?`,
    hint: present ? 'Use mid = low + (high − low) / 2, rounding down.' : 'The target might not be in the array.',
    options,
    correctIndex: options.indexOf(answer),
    explain: `Binary Search checks ${answer} midpoint${answer === 1 ? '' : 's'} ${present ? `before finding ${target}` : `before concluding ${target} is absent`}.`,
    verify: { slug: 'binary-search', input, target },
  };
}

const cache = new Map();

/** The three rounds for puzzle number `n`. */
export function generateChallenge(n) {
  if (cache.has(n)) return cache.get(n);
  const rng = mulberry32(n * 2654435761);

  const rounds = [
    swapRound(rng, {
      id: 'first-move',
      kicker: 'First move',
      pool: EASY_POOL,
      size: 6,
      minMoves: 3,
      nth: () => 1,
    }),
    swapRound(rng, {
      id: 'fast-forward',
      kicker: 'Fast forward',
      pool: HARD_POOL,
      size: 7,
      minMoves: 5,
      nth: (total) => int(rng, 3, Math.min(5, total - 1)),
    }),
    binarySearchRound(rng),
  ];

  const challenge = { number: n, rounds };
  cache.set(n, challenge);
  return challenge;
}

/** Visualiser deep link with the round's exact input. */
export function verifyLink({ slug, input, target }) {
  const params = new URLSearchParams({ input: input.join(',') });
  if (target != null) params.set('target', String(target));
  return `/traceflow/visualizer/${slug}?${params}`;
}
