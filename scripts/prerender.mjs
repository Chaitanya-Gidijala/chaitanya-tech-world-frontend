#!/usr/bin/env node
/**
 * Static SEO prerender — runs after `vite build`.
 *
 * For every public route this writes dist/<route>/index.html containing:
 *   • a unique <title>, description, keywords, canonical URL, Open Graph + Twitter tags
 *   • JSON-LD structured data where it helps (algorithms, comparisons, the daily puzzle)
 *   • real, crawlable page content inside #root (React replaces it on boot)
 * …and regenerates dist/sitemap.xml from the same route list.
 *
 * nginx (`try_files $uri $uri/ /index.html`) and Vercel both serve
 * <route>/index.html before falling back to the SPA shell.
 *
 *   SITE_URL=https://example.com node scripts/prerender.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const src = (p) => pathToFileURL(path.join(root, 'src', p)).href;

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://chaitanyatechworld.com').replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const { getAllAlgorithms, CATEGORIES } = await import(src('apps/traceflow/algorithms/index.js'));
const seo = await import(src('apps/traceflow/seo.js'));
const { ROADMAP_REGISTRY, roadmapTopics } = await import(src('features/roadmap/data/roadmapRegistry.js'));
const { claudeFoundationsData } = await import(src('features/roadmap/data/claudeFoundationsData.js'));
const { claudeDeveloperData } = await import(src('features/roadmap/data/claudeDeveloperData.js'));

/* ── HTML helpers ─────────────────────────────────────────────────────── */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const section = (title, body) => `<section class="ds-section ds-section--compact"><h2>${esc(title)}</h2>${body}</section>`;
const shell = (h1, lead, body = '') =>
  `<main class="ds-container prerender" id="main"><h1>${esc(h1)}</h1><p>${esc(lead)}</p>${body}</main>`;

const SITE_NAV = list([
  link('/', 'Home'),
  link('/daily', 'Daily algorithm puzzle'),
  link('/roadmap', 'Developer roadmaps'),
  link('/roadmap/certifications/claude', 'Claude certifications'),
  link('/traceflow', 'Traceflow algorithm visualiser'),
  link('/prompts', 'AI image prompt library'),
]);

/* ── Routes ───────────────────────────────────────────────────────────── */

const algorithms = getAllAlgorithms();
const routes = [];
const add = (r) => routes.push({ changefreq: 'weekly', priority: 0.7, ...r });

add({
  path: '/',
  priority: 1.0,
  changefreq: 'daily',
  title: 'Chaitanya Tech World — Learn. Visualise. Build.',
  description:
    'Free developer roadmaps, a daily algorithm puzzle, animated algorithm visualisations, Claude certification study guides and a curated AI image prompt library.',
  body: shell(
    'Chaitanya Tech World — learn, visualise, build',
    'Free developer roadmaps, a daily algorithm puzzle with streaks, step-by-step algorithm visualisations and Claude certification study guides.',
    section('Explore', SITE_NAV),
  ),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chaitanya Tech World',
    url: `${SITE_URL}/`,
    author: { '@type': 'Person', name: 'Chaitanya Gidijala' },
  },
});

add({
  path: '/daily',
  priority: 0.9,
  changefreq: 'daily',
  title: 'Traceflow Daily — A New Algorithm Puzzle Every Day | Chaitanya Tech World',
  description:
    'A free 3-round algorithm puzzle every day: predict the next swap, fast-forward a sort and count binary-search steps. Same puzzle worldwide, shareable score, daily streaks.',
  body: shell(
    'Traceflow Daily — the algorithm puzzle of the day',
    'Three rounds, one shot each, the same puzzle for everyone in the world. Solve it, share your squares and keep your streak alive.',
    section(
      'How it works',
      list([
        'Round 1 · First move — predict the array after the first swap.',
        'Round 2 · Fast forward — predict the array after several swaps of a harder algorithm.',
        'Round 3 · Count it — how many midpoints does Binary Search check?',
      ]),
    ),
  ),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Traceflow Daily',
    url: `${SITE_URL}/daily`,
    description: 'A daily algorithm puzzle for developers.',
    genre: 'Puzzle',
    isAccessibleForFree: true,
  },
});

add({
  path: '/roadmap',
  priority: 0.9,
  title: 'Developer Roadmaps & AI Certifications | Chaitanya Tech World',
  description: 'Free structured roadmaps for Java, Frontend, Full Stack and DevOps, plus Claude AI certification study guides, with progress tracking.',
  body: shell(
    'Developer roadmaps',
    'Structured, free learning paths with progress tracking.',
    section('Roadmaps', list(Object.values(ROADMAP_REGISTRY).map((r) => link(`/roadmap/${r.id}`, `${r.title} roadmap`)))),
  ),
});

for (const rm of Object.values(ROADMAP_REGISTRY)) {
  const topics = roadmapTopics(rm);
  add({
    path: `/roadmap/${rm.id}`,
    priority: 0.9,
    title: `${rm.title} Roadmap 2026 — ${topics.length} Topics, Step by Step | Chaitanya Tech World`,
    description: `${rm.description} ${rm.phases.length} phases, ${topics.length} topics, about ${rm.estimatedWeeks} weeks. Track your progress as you learn.`.slice(0, 300),
    body: shell(
      `${rm.title} roadmap`,
      rm.description,
      rm.phases
        .map((ph) =>
          section(
            `Phase ${ph.phase}: ${ph.title} — ${ph.subtitle}`,
            ph.sections.map((s) => `<h3>${esc(s.title)}</h3>${list(s.topics.map((t) => esc(t.name)))}`).join(''),
          ),
        )
        .join(''),
    ),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: `${rm.title} roadmap`,
      description: rm.description,
      provider: { '@type': 'Organization', name: 'Chaitanya Tech World', sameAs: SITE_URL },
      isAccessibleForFree: true,
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `P${rm.estimatedWeeks}W` },
    },
  });
}

add({
  path: '/roadmap/certifications/claude',
  priority: 0.8,
  title: 'Claude AI Certifications — Study Guides | Chaitanya Tech World',
  description: 'Study guides for the Anthropic Claude certifications, from Foundations to Developer: domains, weights, objectives and resources.',
  body: shell(
    'Claude AI certification study guides',
    'Domain-by-domain study guides for the Claude certifications.',
    section(
      'Guides',
      list([claudeFoundationsData, claudeDeveloperData].map((c) => link(`/roadmap/certifications/${c.slug}`, `${c.shortName} study guide`))),
    ),
  ),
});

for (const cert of [claudeFoundationsData, claudeDeveloperData]) {
  add({
    path: `/roadmap/certifications/${cert.slug}`,
    priority: 0.8,
    title: `${cert.shortName} Study Guide — Domains, Weights & Resources | Chaitanya Tech World`,
    description: String(cert.description).slice(0, 300),
    body: shell(
      `${cert.shortName} study guide`,
      cert.description,
      (cert.domains ?? []).map((d) => section(`Domain ${d.number}: ${d.title}`, `<p>${esc(d.description)}</p>`)).join(''),
    ),
  });
}

add({
  path: '/traceflow',
  priority: 0.9,
  title: 'Traceflow — Visual Algorithm Explorer | Chaitanya Tech World',
  description: 'Watch sorting and searching algorithms run step by step with synced Java code, pseudocode, trace logs and complexity analysis.',
  body: shell(
    'Traceflow — see algorithms think',
    'Step-by-step visualisations of sorting and searching algorithms with synced Java code.',
    section('Algorithms', list(algorithms.map((a) => link(seo.detailUrl(a.slug), a.name)))),
  ),
});

add({
  path: '/traceflow/catalogue',
  priority: 0.8,
  title: 'Algorithm Catalogue — Traceflow | Chaitanya Tech World',
  description: 'Browse every Traceflow algorithm by category, difficulty and complexity, then open it in the step-by-step visualiser.',
  body: shell(
    'Algorithm catalogue',
    'Every algorithm, grouped by category.',
    CATEGORIES.map((c) =>
      section(
        c.name,
        `<p>${esc(c.description)}</p>` +
          list(algorithms.filter((a) => a.category === c.id).map((a) => `${link(seo.detailUrl(a.slug), a.name)} — ${esc(a.timeComplexity)}`)),
      ),
    ).join(''),
  ),
});

for (const algo of algorithms) {
  const meta = seo.algorithmMeta(algo);
  const pairs = seo.comparePairs().filter(([x, y]) => x.slug === algo.slug || y.slug === algo.slug);
  const cx = algo.complexity ?? {};
  add({
    ...meta,
    priority: 0.8,
    jsonLd: seo.algorithmJsonLd(algo, SITE_URL),
    body: shell(
      `${algo.name}, explained step by step`,
      algo.summary,
      `<p><strong>Intuition:</strong> ${esc(algo.intuition)}</p>` +
        section('How it works', `<ol>${(algo.steps ?? []).map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`) +
        section(
          'Complexity',
          list([
            `Best: ${esc(cx.best ?? '—')}`,
            `Average: ${esc(cx.average ?? algo.timeComplexity)}`,
            `Worst: ${esc(cx.worst ?? '—')}`,
            `Space: ${esc(cx.space ?? algo.spaceComplexity)}`,
            `Stable: ${algo.stable ? 'yes' : 'no'}`,
          ]),
        ) +
        section('When to use it', `<p>${esc(algo.whenToUse)}</p>`) +
        (algo.interviewQuestions?.length ? section('Interview questions', list(algo.interviewQuestions.map(esc))) : '') +
        section(
          `Compare ${algo.name}`,
          list(pairs.map(([x, y]) => link(seo.compareUrl(x.slug, y.slug), `${x.name} vs ${y.name}`))),
        ) +
        `<p>${link(`/traceflow/visualizer/${algo.slug}`, `Open ${algo.name} in the visualiser`)}</p>`,
    ),
  });
}

for (const [a, b] of seo.comparePairs()) {
  const bench = seo.benchmark(a, b);
  const meta = seo.compareMeta(a, b);
  add({
    ...meta,
    priority: 0.6,
    changefreq: 'monthly',
    jsonLd: seo.compareJsonLd(a, b, SITE_URL),
    body: shell(
      `${a.name} vs ${b.name}`,
      seo.compareVerdict(a, b, bench),
      section(
        'Head-to-head on identical inputs (comparisons)',
        `<table><thead><tr><th>Input</th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr></thead><tbody>${bench
          .map((r) => `<tr><td>${esc(r.scenario.label)}</td><td>${r.a.comparisons}</td><td>${r.b.comparisons}</td></tr>`)
          .join('')}</tbody></table>`,
      ) +
        section(
          'Complexity',
          `<table><thead><tr><th></th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr></thead><tbody>` +
            [
              ['Average time', a.complexity?.average ?? a.timeComplexity, b.complexity?.average ?? b.timeComplexity],
              ['Worst time', a.complexity?.worst, b.complexity?.worst],
              ['Space', a.spaceComplexity, b.spaceComplexity],
              ['Stable', a.stable ? 'Yes' : 'No', b.stable ? 'Yes' : 'No'],
            ]
              .map(([l, x, y]) => `<tr><th>${esc(l)}</th><td>${esc(x ?? '—')}</td><td>${esc(y ?? '—')}</td></tr>`)
              .join('') +
            '</tbody></table>',
        ) +
        section(`When to use ${a.name}`, `<p>${esc(a.whenToUse)}</p>`) +
        section(`When to use ${b.name}`, `<p>${esc(b.whenToUse)}</p>`),
    ),
  });
}

add({
  path: '/prompts',
  priority: 0.8,
  changefreq: 'daily',
  title: 'AI Image Prompt Library | Chaitanya Tech World',
  description: 'Hand-picked image-generation prompts for ChatGPT, Gemini, Midjourney and more. Copy, paste and create.',
  body: shell('AI image prompt library', 'Hand-picked image-generation prompts for ChatGPT, Gemini, Midjourney and more.'),
});

add({
  path: '/contact',
  priority: 0.4,
  changefreq: 'yearly',
  title: 'Contact | Chaitanya Tech World',
  description: 'Get in touch with Chaitanya Tech World.',
  body: shell('Contact', 'Get in touch with Chaitanya Tech World.'),
});

add({
  path: '/progress',
  noindex: true,
  title: 'Your progress — streaks, XP and achievements | Chaitanya Tech World',
  description: 'Your learning streak, activity calendar, roadmap progress and achievements.',
  body: shell('Your progress', 'Your learning streak, activity calendar, roadmap progress and achievements.'),
});

/* ── Render ───────────────────────────────────────────────────────────── */

const template = await readFile(path.join(dist, 'index.html'), 'utf8');

function setTag(html, regex, replacement) {
  if (!regex.test(html)) throw new Error(`prerender: template is missing ${regex}`);
  return html.replace(regex, replacement);
}

function render(route) {
  const url = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`);
  html = setTag(html, /<meta name="title" content="[^"]*">/, `<meta name="title" content="${esc(route.title)}">`);
  html = setTag(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(route.description)}">`);
  if (route.keywords) {
    html = setTag(html, /<meta name="keywords" content="[^"]*">/, `<meta name="keywords" content="${esc([].concat(route.keywords).join(', '))}">`);
  }
  html = setTag(html, /<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${route.noindex ? 'noindex, follow' : 'index, follow'}">`);
  html = setTag(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(url)}">`);
  html = setTag(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(route.title)}">`);
  html = setTag(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(route.description)}">`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(route.title)}">`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(route.description)}">`);

  const head = [`<link rel="canonical" href="${esc(url)}">`];
  if (route.jsonLd) {
    head.push(`<script type="application/ld+json" id="ctw-jsonld">${JSON.stringify(route.jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  html = html.replace('</head>', `  ${head.join('\n  ')}\n</head>`);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${route.body}</div>`);
  return html;
}

let written = 0;
for (const route of routes) {
  const file = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, ...route.path.split('/').filter(Boolean), 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, render(route));
  written++;
}

// The SPA fallback for unknown routes keeps the generic shell (no canonical / content).
await writeFile(path.join(dist, '200.html'), template);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((r) => !r.noindex)
  .map(
    (r) =>
      `  <url>\n    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${Number(r.priority).toFixed(1)}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

console.log(`prerender: ${written} pages + sitemap.xml (${routes.filter((r) => !r.noindex).length} URLs) → ${SITE_URL}`);
