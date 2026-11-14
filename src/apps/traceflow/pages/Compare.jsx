import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight, Check, Minus, Play, Trophy } from 'lucide-react';
import { Badge, Button, Card, Container, Reveal, Section, SectionHeader, useDocumentMeta } from '@/design-system';
import { SITE_URL } from '@/design-system/hooks/useDocumentMeta';
import PageHero from '@/components/site/PageHero';
import { DIFFICULTY_TONE, visualizerPath } from '../utils/algoMeta.js';
import MiniBars from '../components/MiniBars.jsx';
import {
  benchmark,
  compareJsonLd,
  compareMeta,
  compareUrl,
  compareVerdict,
  detailUrl,
  parsePair,
  relatedPairs,
} from '../seo.js';
import '../styles/traceflow-pages.css';
import '../styles/compare.css';

const yesNo = (v) =>
  v ? (
    <span className="tfc-yes">
      <Check size={14} aria-hidden="true" /> Yes
    </span>
  ) : (
    <span className="tfc-no">
      <Minus size={14} aria-hidden="true" /> No
    </span>
  );

function ComplexityTable({ a, b }) {
  const rows = [
    ['Best time', a.complexity?.best, b.complexity?.best],
    ['Average time', a.complexity?.average ?? a.timeComplexity, b.complexity?.average ?? b.timeComplexity],
    ['Worst time', a.complexity?.worst, b.complexity?.worst],
    ['Extra space', a.complexity?.space ?? a.spaceComplexity, b.complexity?.space ?? b.spaceComplexity],
    ['Stable', yesNo(a.stable), yesNo(b.stable)],
    ['In-place', yesNo(a.inPlace), yesNo(b.inPlace)],
    ['Needs sorted input', yesNo(a.requiresSorted), yesNo(b.requiresSorted)],
    ['Difficulty', <Badge key="a" tone={DIFFICULTY_TONE[a.difficulty]}>{a.difficulty}</Badge>, <Badge key="b" tone={DIFFICULTY_TONE[b.difficulty]}>{b.difficulty}</Badge>],
  ];
  return (
    <div className="tfc-table-wrap">
      <table className="tfc-table">
        <thead>
          <tr>
            <th scope="col">Property</th>
            <th scope="col">{a.name}</th>
            <th scope="col">{b.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, x, y]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{x ?? '—'}</td>
              <td>{y ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BenchmarkTable({ a, b, rows }) {
  const metric = 'comparisons';
  return (
    <div className="tfc-bench">
      {rows.map(({ scenario, a: ma, b: mb }) => {
        const winner = ma[metric] === mb[metric] ? null : ma[metric] < mb[metric] ? 'a' : 'b';
        const peak = Math.max(ma[metric], mb[metric], 1);
        return (
          <Card key={scenario.id} padding="md" className="tfc-bench__card">
            <div className="tfc-bench__head">
              <h3>{scenario.label}</h3>
              {scenario.target != null && <span className="ds-meta">target {scenario.target}</span>}
            </div>
            <MiniBars values={scenario.input} />
            {[
              ['a', a, ma],
              ['b', b, mb],
            ].map(([side, algo, m]) => (
              <div key={side} className={clsx('tfc-bench__row', winner === side && 'is-winner')}>
                <span className="tfc-bench__name">
                  {winner === side && <Trophy size={13} aria-label="Fewer comparisons" />} {algo.name}
                </span>
                <span className="tfc-bench__track">
                  <span style={{ '--w': `${(m[metric] / peak) * 100}%` }} />
                </span>
                <span className="tfc-bench__num">{m[metric]}</span>
              </div>
            ))}
            <p className="ds-meta tfc-bench__foot">
              Swaps {ma.swaps} vs {mb.swaps} · writes {ma.writes} vs {mb.writes} · trace steps {ma.steps} vs {mb.steps}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

function SideCard({ algo }) {
  return (
    <Card padding="md" className="tfc-side">
      <h3>{algo.name}</h3>
      <p className="tfc-side__intuition">{algo.intuition}</p>
      {algo.pros?.length > 0 && (
        <>
          <h4>Strengths</h4>
          <ul className="tfc-list tfc-list--pro">
            {algo.pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}
      {algo.cons?.length > 0 && (
        <>
          <h4>Weaknesses</h4>
          <ul className="tfc-list tfc-list--con">
            {algo.cons.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}
      <h4>Use it when</h4>
      <p className="tfc-side__when">{algo.whenToUse}</p>
      <div className="tfc-side__actions">
        <Button to={visualizerPath(algo.slug)} size="sm" iconStart={<Play size={14} />}>
          Visualise
        </Button>
        <Button to={detailUrl(algo.slug)} size="sm" variant="secondary">
          Full guide
        </Button>
      </div>
    </Card>
  );
}

/** /traceflow/compare/:pair — e.g. bubble-sort-vs-quick-sort */
export default function Compare() {
  const { pair } = useParams();
  const resolved = parsePair(pair);
  const a = resolved?.a;
  const b = resolved?.b;
  const rows = useMemo(() => (a && b ? benchmark(a, b) : []), [a, b]);
  const meta = a && b ? compareMeta(a, b) : {};

  useDocumentMeta({
    ...meta,
    jsonLd: a && b ? compareJsonLd(a, b, SITE_URL) : undefined,
  });

  if (!resolved) return <Navigate to="/traceflow/catalogue" replace />;
  if (`/traceflow/compare/${pair}` !== resolved.canonical) return <Navigate to={resolved.canonical} replace />;

  const related = relatedPairs(a, b);

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: 'Traceflow', to: '/traceflow' },
          { label: 'Catalogue', to: '/traceflow/catalogue' },
          { label: `${a.name} vs ${b.name}` },
        ]}
        meta={
          <>
            <Badge tone="accent">Comparison</Badge>
            <Badge>{a.category}</Badge>
          </>
        }
        title={
          <>
            {a.name} <span className="ds-gradient-text">vs</span> {b.name}
          </>
        }
        description={compareVerdict(a, b, rows)}
        actions={
          <>
            <Button to={visualizerPath(a.slug)} size="lg" iconStart={<Play size={15} />}>
              Run {a.name}
            </Button>
            <Button to={visualizerPath(b.slug)} size="lg" variant="secondary" iconStart={<Play size={15} />}>
              Run {b.name}
            </Button>
          </>
        }
      />

      <Section compact aria-labelledby="tfc-table-title">
        <Container>
          <SectionHeader id="tfc-table-title" eyebrow="At a glance" title="Complexity and properties" />
          <Reveal>
            <ComplexityTable a={a} b={b} />
          </Reveal>
        </Container>
      </Section>

      <Section bordered compact aria-labelledby="tfc-bench-title">
        <Container>
          <SectionHeader
            id="tfc-bench-title"
            eyebrow="Measured, not guessed"
            title="Head-to-head on identical inputs"
            description="Both algorithms run on exactly the same arrays inside Traceflow’s tracer. Fewer comparisons wins the round."
          />
          <BenchmarkTable a={a} b={b} rows={rows} />
        </Container>
      </Section>

      <Section bordered compact aria-labelledby="tfc-sides-title">
        <Container>
          <SectionHeader id="tfc-sides-title" eyebrow="Trade-offs" title="Which one should you use?" />
          <div className="tfc-sides">
            <SideCard algo={a} />
            <SideCard algo={b} />
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section bordered compact aria-labelledby="tfc-related-title">
          <Container>
            <SectionHeader id="tfc-related-title" eyebrow="Keep comparing" title="Related comparisons" />
            <ul className="tfc-related">
              {related.map(([x, y]) => (
                <li key={`${x.slug}-${y.slug}`}>
                  <Link to={compareUrl(x.slug, y.slug)}>
                    {x.name} vs {y.name} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
