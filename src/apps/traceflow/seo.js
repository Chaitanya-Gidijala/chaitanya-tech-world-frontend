/**
 * Traceflow SEO model — shared by the React pages (client meta) and
 * scripts/prerender.mjs (static HTML for crawlers). Pure JS, Node-importable:
 * keep relative imports with explicit `.js` extensions and no `@/` aliases here.
 */
import { getAlgorithm, getAllAlgorithms } from './algorithms/index.js';

export const detailUrl = (slug) => `/traceflow/algorithm/${slug}`;
export const compareUrl = (a, b) => `/traceflow/compare/${a}-vs-${b}`;

/* ── Benchmarks: run both algorithms on identical inputs ─────────────────── */

const SORT_SCENARIOS = [
  { id: 'random', label: 'Random order', input: [38, 7, 91, 24, 63, 15, 82, 46, 3, 57] },
  { id: 'nearly', label: 'Nearly sorted', input: [3, 7, 15, 24, 38, 46, 63, 57, 82, 91] },
  { id: 'reversed', label: 'Reversed', input: [91, 82, 63, 57, 46, 38, 24, 15, 7, 3] },
];

const SEARCH_INPUT = [2, 5, 9, 14, 21, 28, 33, 40, 47, 55, 61, 68, 74, 80, 89, 95];
const SEARCH_SCENARIOS = [
  { id: 'first', label: 'Target is first', input: SEARCH_INPUT, target: 2 },
  { id: 'middle', label: 'Target in the middle', input: SEARCH_INPUT, target: 47 },
  { id: 'last', label: 'Target is last', input: SEARCH_INPUT, target: 95 },
  { id: 'absent', label: 'Target absent', input: SEARCH_INPUT, target: 50 },
];

export function scenariosFor(category) {
  return category === 'searching' ? SEARCH_SCENARIOS : SORT_SCENARIOS;
}

function runMetrics(algo, scenario) {
  const trace = algo.hasTarget ? algo.traceGenerator(scenario.input, scenario.target) : algo.traceGenerator(scenario.input);
  const last = trace.at(-1)?.metrics ?? {};
  return {
    steps: trace.length,
    comparisons: last.comparisons ?? 0,
    swaps: last.swaps ?? 0,
    writes: last.writes ?? 0,
  };
}

/** [{ scenario, a: metrics, b: metrics }] */
export function benchmark(a, b) {
  return scenariosFor(a.category).map((scenario) => ({
    scenario,
    a: runMetrics(a, scenario),
    b: runMetrics(b, scenario),
  }));
}

/* ── Pairs ───────────────────────────────────────────────────────────────── */

/** Every same-category pair, in registry order (a before b). */
export function comparePairs() {
  const all = getAllAlgorithms();
  const pairs = [];
  all.forEach((a, i) => {
    all.slice(i + 1).forEach((b) => {
      if (a.category === b.category) pairs.push([a, b]);
    });
  });
  return pairs;
}

/** Resolve "x-vs-y"; returns { a, b, canonical } or null. */
export function parsePair(pair) {
  const [left, right] = String(pair ?? '').split('-vs-');
  const a = getAlgorithm(left);
  const b = getAlgorithm(right);
  if (!a || !b || a.slug === b.slug || a.category !== b.category) return null;
  const order = getAllAlgorithms().map((x) => x.slug);
  const [first, second] = order.indexOf(a.slug) < order.indexOf(b.slug) ? [a, b] : [b, a];
  return { a: first, b: second, canonical: compareUrl(first.slug, second.slug) };
}

/** Other comparisons featuring either algorithm (for internal linking). */
export function relatedPairs(a, b, limit = 6) {
  return comparePairs()
    .filter(([x, y]) => (x.slug === a.slug || y.slug === a.slug || x.slug === b.slug || y.slug === b.slug) && !(x.slug === a.slug && y.slug === b.slug))
    .slice(0, limit);
}

/* ── Copy ────────────────────────────────────────────────────────────────── */

const avg = (algo) => algo.complexity?.average ?? algo.timeComplexity;

export function algorithmMeta(algo) {
  return {
    path: detailUrl(algo.slug),
    title: `${algo.name} Explained Step by Step — Visualised, with Java Code | Traceflow`,
    description: `${algo.name} visualised step by step: how it works in plain English, ${avg(algo)} average time, ${algo.spaceComplexity} space, Java code and interview questions.`.slice(0, 300),
    keywords: [algo.name, `${algo.name} visualization`, `${algo.name} java`, `${algo.name} time complexity`, 'dsa', 'algorithm visualizer'],
  };
}

export function compareMeta(a, b) {
  return {
    path: compareUrl(a.slug, b.slug),
    title: `${a.name} vs ${b.name} — Complexity, Speed & When to Use Each | Traceflow`,
    description: `${a.name} vs ${b.name}: side-by-side time and space complexity, stability, real operation counts on identical inputs, pros and cons, and which one to choose.`,
    keywords: [`${a.name} vs ${b.name}`, `${b.name} vs ${a.name}`, `${a.name} or ${b.name}`, 'sorting algorithm comparison', 'dsa'],
  };
}

/** A data-driven one-paragraph verdict. */
export function compareVerdict(a, b, bench) {
  const totals = bench.reduce(
    (acc, row) => ({ a: acc.a + row.a.comparisons, b: acc.b + row.b.comparisons }),
    { a: 0, b: 0 },
  );
  const fewer = totals.a === totals.b ? null : totals.a < totals.b ? a : b;
  const parts = [];
  if (fewer) {
    const [lo, hi] = totals.a < totals.b ? [totals.a, totals.b] : [totals.b, totals.a];
    parts.push(`Across our ${bench.length} test inputs, ${fewer.name} needed ${lo} comparisons in total versus ${hi} for ${fewer === a ? b.name : a.name}.`);
  } else {
    parts.push(`Across our ${bench.length} test inputs, both made the same number of comparisons (${totals.a}).`);
  }
  if (avg(a) !== avg(b)) parts.push(`On average ${a.name} runs in ${avg(a)} time and ${b.name} in ${avg(b)}.`);
  if (a.stable !== b.stable) parts.push(`${a.stable ? a.name : b.name} is stable; ${a.stable ? b.name : a.name} is not.`);
  if (a.requiresSorted !== b.requiresSorted) parts.push(`${a.requiresSorted ? a.name : b.name} only works on sorted data.`);
  return parts.join(' ');
}

export function compareJsonLd(a, b, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${a.name} vs ${b.name}`,
    about: [a.name, b.name],
    url: `${siteUrl}${compareUrl(a.slug, b.slug)}`,
    author: { '@type': 'Person', name: 'Chaitanya Gidijala' },
    publisher: { '@type': 'Organization', name: 'Chaitanya Tech World' },
    isAccessibleForFree: true,
  };
}

export function algorithmJsonLd(algo, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: `${algo.name} explained step by step`,
        description: algo.summary,
        url: `${siteUrl}${detailUrl(algo.slug)}`,
        author: { '@type': 'Person', name: 'Chaitanya Gidijala' },
        publisher: { '@type': 'Organization', name: 'Chaitanya Tech World' },
        educationalLevel: algo.difficulty,
        isAccessibleForFree: true,
      },
      {
        '@type': 'HowTo',
        name: `How ${algo.name} works`,
        step: (algo.steps ?? []).map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Traceflow', item: `${siteUrl}/traceflow` },
          { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${siteUrl}/traceflow/catalogue` },
          { '@type': 'ListItem', position: 3, name: algo.name, item: `${siteUrl}${detailUrl(algo.slug)}` },
        ],
      },
    ],
  };
}
