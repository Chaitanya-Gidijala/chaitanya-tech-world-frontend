import { ArrowRight, Hourglass, Play } from 'lucide-react';
import { Button, Container, Reveal, Section, SectionHeader, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import { CATEGORIES, COMING_NEXT, getAllAlgorithms } from '../algorithms/index.js';
import { DIFFICULTY_ORDER, LEARNING_MODES, visualizerPath } from '../utils/algoMeta.js';
import LivePreview from '../components/LivePreview.jsx';
import LearningModes from '../components/LearningModes.jsx';
import AlgoCard from '../components/AlgoCard.jsx';
import ComplexityTable from '../components/ComplexityTable.jsx';
import '../styles/traceflow-pages.css';

const PREVIEW_SLUGS = ['bubble-sort', 'quick-sort', 'heap-sort', 'binary-search'];

/** TraceflowHome — /traceflow landing page. */
export default function Home() {
  const algorithms = getAllAlgorithms();
  const byCategory = (id) =>
    algorithms
      .filter((a) => a.category === id)
      .sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);

  useDocumentMeta({
    title: 'Traceflow — Visual Algorithm Explorer | Chaitanya Tech World',
    description:
      'Watch sorting and searching algorithms run step by step with synced Java code, pseudocode, trace logs and complexity analysis.',
  });

  return (
    <>
      <PageHero
        eyebrow="Traceflow · Algorithm visualiser"
        title={
          <>
            Watch algorithms <span className="ds-gradient-text">think, step by step.</span>
          </>
        }
        description="Every comparison, swap and pointer move animated — with the matching line of Java highlighted and a plain-English reason for each step."
        actions={
          <>
            <Button to="/traceflow/catalogue" size="lg" iconEnd={<ArrowRight size={16} />}>
              Browse all algorithms
            </Button>
            <Button to={visualizerPath('bubble-sort')} size="lg" variant="secondary" iconStart={<Play size={15} />}>
              Start with Bubble Sort
            </Button>
          </>
        }
        aside={<LivePreview slugs={PREVIEW_SLUGS} />}
        stats={[
          { label: 'Algorithms', value: algorithms.length },
          { label: 'Sorting', value: byCategory('sorting').length },
          { label: 'Searching', value: byCategory('searching').length },
          { label: 'Ways to learn each', value: LEARNING_MODES.length },
        ]}
      />

      <Section aria-labelledby="tfp-modes-title">
        <Container>
          <SectionHeader
            id="tfp-modes-title"
            align="center"
            eyebrow="How it explains"
            title={
              <>
                Six ways to <span className="ds-gradient-text">understand every algorithm</span>
              </>
            }
            description="Pick the explanation that clicks for you — or use them all together in the visualiser."
          />
          <LearningModes />
        </Container>
      </Section>

      {CATEGORIES.map((cat) => {
        const list = byCategory(cat.id);
        return (
          <Section key={cat.id} bordered aria-labelledby={`tfp-cat-${cat.id}`}>
            <Container>
              <SectionHeader
                id={`tfp-cat-${cat.id}`}
                eyebrow={`${list.length} algorithms`}
                title={`${cat.name} algorithms`}
                description={cat.description}
                actions={
                  <Button to={`/traceflow/catalogue?category=${cat.id}`} variant="secondary" size="sm" iconEnd={<ArrowRight size={14} />}>
                    View in catalogue
                  </Button>
                }
              />
              <ul className="tfp-grid">
                {list.map((algo, i) => (
                  <Reveal as="li" key={algo.slug} delay={(i % 3) * 0.06}>
                    <AlgoCard algo={algo} />
                  </Reveal>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}

      <Section bordered aria-labelledby="tfp-cheat-title">
        <Container>
          <SectionHeader
            id="tfp-cheat-title"
            eyebrow="Cheat sheet"
            title="Complexity at a glance"
            description="Best, average and worst-case time, space and stability for every algorithm."
          />
          <Reveal>
            <ComplexityTable algorithms={algorithms} />
          </Reveal>
        </Container>
      </Section>

      <Section bordered aria-labelledby="tfp-next-title">
        <Container>
          <SectionHeader id="tfp-next-title" eyebrow="Roadmap" title="Coming next to Traceflow" />
          <ul className="tfp-next">
            {COMING_NEXT.map((group, i) => (
              <Reveal as="li" key={group.id} delay={i * 0.06} className="tfp-next__item">
                <span className="tfp-next__icon">
                  <Hourglass size={16} aria-hidden="true" />
                </span>
                <h3>{group.name}</h3>
                <p>{group.items.join(' · ')}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
