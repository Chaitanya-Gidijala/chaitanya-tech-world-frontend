import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Search } from 'lucide-react';
import { Badge, Button, Container, Section, SectionHeader, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import NewsletterSignup from '@/features/growth/NewsletterSignup';
import ShareBar from '@/features/growth/ShareBar';
import { CATEGORIES, getAllAlgorithms } from '../algorithms/index.js';
import { DIFFICULTY_TONE, visualizerPath } from '../utils/algoMeta.js';
import { detailUrl } from '../seo.js';
import '../styles/traceflow-pages.css';
import '../styles/interview.css';

/** /traceflow/interview-questions — every algorithm interview question, with the facts you need and a visual walkthrough. */
export default function InterviewQuestions() {
  const [query, setQuery] = useState('');
  const algorithms = useMemo(() => getAllAlgorithms().filter((a) => a.interviewQuestions?.length), []);
  const total = algorithms.reduce((s, a) => s + a.interviewQuestions.length, 0);

  useDocumentMeta({
    title: `${total} Sorting & Searching Interview Questions (with Visual Explanations) | Traceflow`,
    description: `Common DSA interview questions on ${algorithms.length} sorting and searching algorithms — with complexity facts, trade-offs and a step-by-step visualisation for each.`,
    keywords: ['sorting interview questions', 'searching interview questions', 'dsa interview questions', 'binary search interview', 'quick sort interview questions'],
  });

  const q = query.trim().toLowerCase();
  const visible = algorithms
    .map((a) => ({ ...a, matches: a.interviewQuestions.filter((x) => !q || x.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)) }))
    .filter((a) => a.matches.length);

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Traceflow', to: '/traceflow' }, { label: 'Interview questions' }]}
        eyebrow="Interview prep"
        title={
          <>
            {total} algorithm interview questions, <span className="ds-gradient-text">explained visually</span>
          </>
        }
        description="The questions interviewers actually ask about sorting and searching — each paired with the key facts and a step-by-step animation of the algorithm."
        actions={
          <Button to="/daily" size="lg" iconEnd={<ArrowRight size={16} />}>
            Practise with today’s puzzle
          </Button>
        }
      />

      <Section compact>
        <Container>
          <label className="iq-search">
            <Search size={16} aria-hidden="true" />
            <input type="search" placeholder="Search questions, e.g. “stable”, “worst case”, “binary search”" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search interview questions" />
          </label>

          {CATEGORIES.map((cat) => {
            const items = visible.filter((a) => a.category === cat.id);
            if (!items.length) return null;
            return (
              <div key={cat.id} className="iq-group">
                <SectionHeader eyebrow={cat.name} title={`${cat.name} algorithms`} description={cat.description} />
                <div className="iq-list">
                  {items.map((a) => (
                    <article key={a.slug} className="iq-card" id={a.slug}>
                      <header className="iq-card__head">
                        <h3>
                          <Link to={detailUrl(a.slug)}>{a.name}</Link>
                        </h3>
                        <Badge tone={DIFFICULTY_TONE[a.difficulty]}>{a.difficulty}</Badge>
                      </header>
                      <ol className="iq-questions">
                        {a.matches.map((question) => (
                          <li key={question}>{question}</li>
                        ))}
                      </ol>
                      <dl className="iq-facts">
                        <div>
                          <dt>Average</dt>
                          <dd>{a.complexity?.average ?? a.timeComplexity}</dd>
                        </div>
                        <div>
                          <dt>Worst</dt>
                          <dd>{a.complexity?.worst ?? '—'}</dd>
                        </div>
                        <div>
                          <dt>Space</dt>
                          <dd>{a.complexity?.space ?? a.spaceComplexity}</dd>
                        </div>
                        <div>
                          <dt>Stable</dt>
                          <dd>{a.stable ? 'Yes' : 'No'}</dd>
                        </div>
                      </dl>
                      <p className="iq-when">
                        <strong>Use it when:</strong> {a.whenToUse}
                      </p>
                      <div className="iq-actions">
                        <Link to={visualizerPath(a.slug)} className="iq-link">
                          <Play size={14} aria-hidden="true" /> Watch it run
                        </Link>
                        <Link to={detailUrl(a.slug)} className="iq-link">
                          Full explanation <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
          {!visible.length && <p className="ds-meta">No questions match “{query}”.</p>}

          <div className="iq-bottom">
            <ShareBar url="/traceflow/interview-questions" text="Sorting & searching interview questions with visual explanations" campaign="interview-questions" title="Share with someone preparing" />
            <NewsletterSignup source="interview-questions" title="Practise a little every day" description="Get a 2-minute algorithm puzzle each morning — the easiest way to stay interview-ready." />
          </div>
        </Container>
      </Section>
    </>
  );
}
