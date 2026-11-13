import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button, Callout, Container, Disclosure, Section, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import ROUTES from '@/constants/routes';
import OutlineLayout from './components/OutlineLayout';
import ExpandAllButton from './components/ExpandAllButton';
import { useExpandableSet } from './hooks/useExpandableSet';
import { javaRoadmapData } from './data/javaRoadmapData';
import { frontendRoadmapData } from './data/frontendRoadmapData';
import './roadmap.css';

const ROADMAP_REGISTRY = {
  java: javaRoadmapData,
  frontend: frontendRoadmapData,
};

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

function countTopics(phases) {
  return phases.reduce((sum, ph) => sum + ph.sections.reduce((a, s) => a + s.topics.length, 0), 0);
}

function PhaseSummary({ phase }) {
  return (
    <span className="rm-item-summary">
      <span className="rm-item-summary__label">Phase {String(phase.phase).padStart(2, '0')}</span>
      <span className="rm-item-summary__title">{phase.title}</span>
      <span className="rm-item-summary__sub">{phase.subtitle}</span>
      <span className="rm-item-summary__meta">
        <Clock size={13} aria-hidden="true" /> {phase.estimatedWeeks}
      </span>
    </span>
  );
}

function PhaseBody({ phase }) {
  return (
    <div className="rm-topic-groups">
      {phase.sections.map((section) => (
        <section key={section.id} className="rm-topic-group">
          <header className="rm-topic-group__head">
            <h3>{section.title}</h3>
            <span className="ds-meta">{section.topics.length}</span>
          </header>
          <ul className="rm-topics">
            {section.topics.map((topic, i) => (
              <li key={`${topic.name}-${i}`} className="rm-topic">
                <span className={`rm-level-dot rm-level-dot--${topic.level}`} aria-hidden="true" />
                <span className="rm-topic__name">{topic.name}</span>
                <span className="ds-visually-hidden">— {topic.level}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function RoadmapDetail({ data }) {
  const phaseIds = useMemo(() => data.phases.map((p) => p.id), [data]);
  const { isOpen, setItem, allOpen, toggleAll } = useExpandableSet(phaseIds, [phaseIds[0]]);
  const totalTopics = countTopics(data.phases);

  useDocumentMeta({
    title: `${data.title} Roadmap 2026 | Chaitanya Tech World`,
    description: data.description,
  });

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Roadmaps', to: ROUTES.ROADMAPS }, { label: data.title }]}
        eyebrow="Developer roadmap"
        title={data.title}
        description={data.description}
        stats={[
          { label: 'Phases', value: data.phases.length },
          { label: 'Topics', value: `${totalTopics}+` },
          { label: 'Duration', value: `${data.estimatedWeeks} wks` },
          { label: 'Cost', value: 'Free' },
        ]}
      />

      <Section>
        <Container>
          <OutlineLayout
            title="Phases"
            items={data.phases.map((p) => ({ id: p.id, label: p.title }))}
            onSelect={(id) => setItem(id, true)}
            toolbar={
              <>
                <ul className="rm-legend" aria-label="Topic level legend">
                  {LEVELS.map((l) => (
                    <li key={l.id}>
                      <span className={`rm-level-dot rm-level-dot--${l.id}`} aria-hidden="true" />
                      {l.label}
                    </li>
                  ))}
                </ul>
                <ExpandAllButton allOpen={allOpen} onClick={toggleAll} />
              </>
            }
          >
            <div className="rm-stack">
              {data.phases.map((phase) => (
                <Disclosure
                  key={phase.id}
                  id={phase.id}
                  className="rm-item"
                  headingLevel={2}
                  open={isOpen(phase.id)}
                  onOpenChange={(v) => setItem(phase.id, v)}
                  summary={<PhaseSummary phase={phase} />}
                >
                  <PhaseBody phase={phase} />
                </Disclosure>
              ))}
            </div>

            <Callout
              tone="accent"
              className="rm-cta"
              title="While you learn, create"
              action={
                <Button to={ROUTES.PROMPTS} size="sm" iconEnd={<ArrowRight size={14} />}>
                  Browse prompts
                </Button>
              }
            >
              Explore a curated library of image-generation prompts for ChatGPT, Gemini, Midjourney and more.
            </Callout>
          </OutlineLayout>
        </Container>
      </Section>
    </>
  );
}

export default function RoadmapPage() {
  const { tech } = useParams();
  const data = ROADMAP_REGISTRY[tech];

  if (!data) return <Navigate to={ROUTES.ROADMAPS} replace />;

  // `key` resets expanded state when navigating between roadmaps.
  return <RoadmapDetail key={tech} data={data} />;
}
