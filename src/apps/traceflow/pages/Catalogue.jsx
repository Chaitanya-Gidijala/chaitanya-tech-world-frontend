import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutGrid, Rows3, Search } from 'lucide-react';
import {
  Button,
  Container,
  EmptyState,
  Reveal,
  Section,
  SelectField,
  TextField,
  useDocumentMeta,
} from '@/design-system';
import PageHero from '@/components/site/PageHero';
import { CATEGORIES, COMING_NEXT, getAllAlgorithms } from '../algorithms/index.js';
import { DIFFICULTY_ORDER, complexityRank } from '../utils/algoMeta.js';
import AlgoCard from '../components/AlgoCard.jsx';
import ComplexityTable from '../components/ComplexityTable.jsx';
import '../styles/traceflow-pages.css';

const ALL = 'all';
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const SORTS = {
  difficulty: { label: 'Difficulty', fn: (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] },
  name: { label: 'Name (A–Z)', fn: (a, b) => a.name.localeCompare(b.name) },
  speed: { label: 'Fastest average case', fn: (a, b) => complexityRank(a.complexity.average) - complexityRank(b.complexity.average) },
};

function Chips({ label, options, value, onChange }) {
  return (
    <div className="tfp-chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={clsx('tfp-chip', value === o.value && 'is-active')}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
          {o.count != null && <span className="tfp-chip__count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Catalogue — /traceflow/catalogue. Filters live in the URL so they survive navigation. */
export default function Catalogue() {
  const algorithms = getAllAlgorithms();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? ALL;
  const difficulty = params.get('level') ?? ALL;
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'difficulty';
  const view = params.get('view') === 'table' ? 'table' : 'grid';

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (!v || v === ALL || (k === 'sort' && v === 'difficulty') || (k === 'view' && v === 'grid')) next.delete(k);
      else next.set(k, v);
    });
    setParams(next, { replace: true });
  };

  useDocumentMeta({
    title: 'Algorithm Catalogue — Traceflow | Chaitanya Tech World',
    description: 'Browse every Traceflow algorithm by category, difficulty and complexity, then open it in the step-by-step visualiser.',
  });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return algorithms
      .filter(
        (a) =>
          (category === ALL || a.category === category) &&
          (difficulty === ALL || a.difficulty === difficulty) &&
          (!query || `${a.name} ${a.tags.join(' ')} ${a.summary}`.toLowerCase().includes(query)),
      )
      .sort(SORTS[sort].fn);
  }, [algorithms, q, category, difficulty, sort]);

  const hasFilters = q || category !== ALL || difficulty !== ALL;
  const count = (key, val) => algorithms.filter((a) => a[key] === val).length;

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Traceflow', to: '/traceflow' }, { label: 'Catalogue' }]}
        eyebrow={`${algorithms.length} algorithms · all free`}
        title={
          <>
            The algorithm <span className="ds-gradient-text">catalogue</span>
          </>
        }
        description="Filter by category or difficulty, compare complexities, and open any algorithm in the visualiser."
      />

      <Section compact>
        <Container>
          <div className="tfp-toolbar">
            <TextField
              className="tfp-toolbar__search"
              type="search"
              label="Search"
              placeholder="Name, tag or idea — e.g. “heap”, “stable”"
              value={q}
              onChange={(e) => update({ q: e.target.value })}
            />
            <SelectField
              label="Sort by"
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              options={Object.entries(SORTS).map(([value, s]) => ({ value, label: s.label }))}
            />
          </div>

          <div className="tfp-filters">
            <Chips
              label="Category"
              value={category}
              onChange={(v) => update({ category: v })}
              options={[
                { value: ALL, label: 'All', count: algorithms.length },
                ...CATEGORIES.map((c) => ({ value: c.id, label: c.name, count: count('category', c.id) })),
              ]}
            />
            <Chips
              label="Difficulty"
              value={difficulty}
              onChange={(v) => update({ level: v })}
              options={[
                { value: ALL, label: 'Any level' },
                ...DIFFICULTIES.map((d) => ({ value: d, label: d[0].toUpperCase() + d.slice(1), count: count('difficulty', d) })),
              ]}
            />
            <div className="tfp-view" role="group" aria-label="View">
              <button
                type="button"
                className={clsx('tfp-view__btn', view === 'grid' && 'is-active')}
                aria-pressed={view === 'grid'}
                aria-label="Card view"
                onClick={() => update({ view: 'grid' })}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={clsx('tfp-view__btn', view === 'table' && 'is-active')}
                aria-pressed={view === 'table'}
                aria-label="Table view"
                onClick={() => update({ view: 'table' })}
              >
                <Rows3 size={16} />
              </button>
            </div>
          </div>

          <div className="tfp-results-bar">
            <p aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'algorithm' : 'algorithms'}
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => update({ q: '', category: ALL, level: ALL })}>
                Clear filters
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={20} />}
              title="No algorithms match"
              description="Try a different search term or remove a filter."
              action={
                <Button variant="secondary" onClick={() => update({ q: '', category: ALL, level: ALL })}>
                  Show all algorithms
                </Button>
              }
            />
          ) : view === 'table' ? (
            <ComplexityTable algorithms={filtered} />
          ) : (
            <ul className="tfp-grid">
              {filtered.map((algo, i) => (
                <Reveal as="li" key={algo.slug} delay={(i % 3) * 0.05}>
                  <AlgoCard algo={algo} />
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section bordered compact aria-labelledby="tfp-next-title">
        <Container>
          <h2 id="tfp-next-title" className="tfp-next__title">
            Coming next
          </h2>
          <ul className="tfp-next">
            {COMING_NEXT.map((g) => (
              <li key={g.id} className="tfp-next__item">
                <h3>{g.name}</h3>
                <p>{g.items.join(' · ')}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
