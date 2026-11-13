import { Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Badge, Button, Container, Reveal, Section, SectionHeader, useDocumentMeta } from '@/design-system';
import { useTheme } from '@/hooks/useTheme';
import PageHero from '@/components/site/PageHero';
import { getAlgorithm, getAllAlgorithms } from '../algorithms/index.js';
import { DIFFICULTY_TONE, visualizerPath } from '../utils/algoMeta.js';
import LearnPanel from '../components/visualizer/LearnPanel.jsx';
import CodePanel from '../components/visualizer/CodePanel.jsx';
import AlgoCard from '../components/AlgoCard.jsx';
import MiniBars from '../components/MiniBars.jsx';
import PlainEnglish from '../components/PlainEnglish.jsx';
import WorkedExample from '../components/WorkedExample.jsx';
import '../styles/traceflow-pages.css';
import '../styles/visualizer-extras.css';
import '../styles/algorithm-explainer.css';

/** AlgorithmDetail — /traceflow/algorithm/:slug reference page. */
export default function AlgorithmDetail() {
  const { slug } = useParams();
  const algo = getAlgorithm(slug);
  const { theme } = useTheme();

  useDocumentMeta({
    title: algo ? `${algo.name} — Traceflow | Chaitanya Tech World` : 'Traceflow',
    description: algo?.summary,
  });

  if (!algo) return <Navigate to="/traceflow/catalogue" replace />;

  const related = getAllAlgorithms()
    .filter((a) => a.category === algo.category && a.slug !== algo.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: 'Traceflow', to: '/traceflow' },
          { label: 'Catalogue', to: '/traceflow/catalogue' },
          { label: algo.name },
        ]}
        meta={
          <>
            <Badge tone={DIFFICULTY_TONE[algo.difficulty]}>{algo.difficulty}</Badge>
            <Badge>{algo.category}</Badge>
            <Badge tone="accent">{algo.complexity?.average ?? algo.timeComplexity} average</Badge>
          </>
        }
        title={algo.name}
        description={algo.intuition}
        actions={
          <>
            <Button to={visualizerPath(algo.slug)} size="lg" iconStart={<Play size={15} />}>
              Open in visualiser
            </Button>
            <Button to="/traceflow/catalogue" size="lg" variant="secondary" iconStart={<ArrowLeft size={15} />}>
              All algorithms
            </Button>
          </>
        }
        aside={
          <div className="tfp-detail-thumb">
            <MiniBars values={algo.defaultInput} />
            <p>
              Default input: <code>[{algo.defaultInput.join(', ')}]</code>
              {algo.hasTarget && (
                <>
                  {' '}
                  · target <code>{algo.defaultTarget}</code>
                </>
              )}
            </p>
          </div>
        }
      />

      <Section aria-labelledby="tfp-plain-title">
        <Container>
          <div className="tfp-explain-grid">
            <div>
              <SectionHeader
                id="tfp-plain-title"
                eyebrow="Explained simply"
                title={
                  <>
                    {algo.name}, <span className="ds-gradient-text">in plain English</span>
                  </>
                }
                description="Read it, or press Listen to hear it explained out loud."
              />
              <Reveal>
                <PlainEnglish algo={algo} />
              </Reveal>
            </div>
            <div>
              <SectionHeader
                eyebrow="Worked example"
                title="Watch it step by step"
                description="A real run on a tiny input — every key move, in words."
              />
              <Reveal delay={0.1}>
                <WorkedExample algo={algo} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section bordered compact aria-labelledby="tfp-ref-title">
        <Container>
          <SectionHeader id="tfp-ref-title" eyebrow="Reference" title="Complexity, trade-offs and code" />
          <div className="tfp-detail">
            <Reveal className="tfp-detail__main">
              <LearnPanel algo={algo} />
            </Reveal>
            <Reveal delay={0.1} className="tfp-detail__side">
              <h2 className="tfp-detail__side-title">Implementation</h2>
              <CodePanel algo={algo} theme={theme} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section bordered compact aria-labelledby="tfp-related-title">
          <Container>
            <SectionHeader id="tfp-related-title" eyebrow="Keep going" title={`More ${algo.category} algorithms`} />
            <ul className="tfp-grid">
              {related.map((a) => (
                <li key={a.slug}>
                  <AlgoCard algo={a} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
