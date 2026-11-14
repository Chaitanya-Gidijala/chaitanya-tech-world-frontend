import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight, Check, Clock, Flame } from 'lucide-react';
import { Button, Callout, Container, Disclosure, Section, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import ROUTES from '@/constants/routes';
import OutlineLayout from './components/OutlineLayout';
import ExpandAllButton from './components/ExpandAllButton';
import { useExpandableSet } from './hooks/useExpandableSet';
import { ROADMAP_REGISTRY, roadmapProgress, topicKey } from './data/roadmapRegistry';
import { useRoadmapProgress, useProgressSummary } from '@/features/engagement/hooks/useProgress';
import { setTopicDone } from '@/features/engagement/lib/store';
import './roadmap.css';

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

function countTopics(phases) {
  return phases.reduce((sum, ph) => sum + ph.sections.reduce((a, s) => a + s.topics.length, 0), 0);
}

function phaseCounts(phase, done) {
  let total = 0;
  let complete = 0;
  phase.sections.forEach((section) =>
    section.topics.forEach((topic) => {
      total++;
      if (done[topicKey(section, topic)]) complete++;
    }),
  );
  return { total, complete };
}

function PhaseSummary({ phase, done }) {
  const { total, complete } = phaseCounts(phase, done);
  return (
    <span className="rm-item-summary">
      <span className="rm-item-summary__label">Phase {String(phase.phase).padStart(2, '0')}</span>
      <span className="rm-item-summary__title">{phase.title}</span>
      <span className="rm-item-summary__sub">{phase.subtitle}</span>
      <span className="rm-item-summary__meta">
        <Clock size={13} aria-hidden="true" /> {phase.estimatedWeeks}
        <span className={clsx('rm-phase-count', complete === total && 'is-complete')}>
          {complete === total ? <Check size={12} aria-hidden="true" /> : null}
          {complete}/{total} done
        </span>
      </span>
    </span>
  );
}

function PhaseBody({ phase, roadmapId, done }) {
  return (
    <div className="rm-topic-groups">
      {phase.sections.map((section) => (
        <section key={section.id} className="rm-topic-group">
          <header className="rm-topic-group__head">
            <h3>{section.title}</h3>
            <span className="ds-meta">{section.topics.length}</span>
          </header>
          <ul className="rm-topics">
            {section.topics.map((topic, i) => {
              const key = topicKey(section, topic);
              const isDone = Boolean(done[key]);
              return (
                <li key={`${topic.name}-${i}`} className={clsx('rm-topic', isDone && 'is-done')}>
                  <label className="rm-topic__check">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(e) => setTopicDone(roadmapId, key, e.target.checked)}
                    />
                    <span className="rm-topic__box" aria-hidden="true">
                      <Check size={12} />
                    </span>
                    <span className={`rm-level-dot rm-level-dot--${topic.level}`} aria-hidden="true" />
                    <span className="rm-topic__name">{topic.name}</span>
                    <span className="ds-visually-hidden">— {topic.level}</span>
                  </label>
                </li>
              );
            })}
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
  const done = useRoadmapProgress(data.id);
  const progress = roadmapProgress(data, done);
  const { streak } = useProgressSummary();

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
          { label: 'Your progress', value: `${progress.percent}%` },
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
            <div className="rm-progress" aria-live="polite">
              <div className="rm-progress__top">
                <span>
                  <strong>{progress.done}</strong> of {progress.total} topics complete
                </span>
                {streak.current > 0 && (
                  <span className="rm-progress__streak">
                    <Flame size={14} aria-hidden="true" /> {streak.current}-day streak
                  </span>
                )}
              </div>
              <div
                className="rm-progress__track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress.percent}
                aria-label={`${data.title} roadmap progress`}
              >
                <span className="rm-progress__bar" style={{ '--p': `${progress.percent}%` }} />
              </div>
              <p className="rm-progress__hint">
                {progress.next ? (
                  <>
                    Up next: <strong>{progress.next.name}</strong>
                    <span className="ds-meta"> · {progress.next.phase.title}</span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setItem(progress.next.phase.id, true);
                        requestAnimationFrame(() =>
                          document.getElementById(progress.next.phase.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                        );
                      }}
                    >
                      Jump there
                    </Button>
                  </>
                ) : (
                  <>🎉 Roadmap complete — incredible work.</>
                )}
              </p>
              <p className="ds-meta">Tick topics as you learn them. Each one earns XP and keeps your daily streak alive. Progress is saved on this device.</p>
            </div>

            <div className="rm-stack">
              {data.phases.map((phase) => (
                <Disclosure
                  key={phase.id}
                  id={phase.id}
                  className="rm-item"
                  headingLevel={2}
                  open={isOpen(phase.id)}
                  onOpenChange={(v) => setItem(phase.id, v)}
                  summary={<PhaseSummary phase={phase} done={done} />}
                >
                  <PhaseBody phase={phase} roadmapId={data.id} done={done} />
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
