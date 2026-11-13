import clsx from 'clsx';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button, Container, Section, SectionHeader } from '@/design-system';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SHOWCASE } from '../data/homeContent';
import { CertPreview, PromptPreview, RoadmapPreview, TraceflowPreview } from './Previews';

const PREVIEWS = {
  roadmaps: RoadmapPreview,
  traceflow: TraceflowPreview,
  certs: CertPreview,
  prompts: PromptPreview,
};

const IDS = SHOWCASE.map((s) => s.id);

/** Device-style frame around a preview. */
function Frame({ label, children }) {
  return (
    <div className="hp-frame">
      <div className="hp-frame__bar">
        <span className="hp-window__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="hp-frame__url">chaitanyatechworld.com/{label}</span>
      </div>
      <div className="hp-frame__body">{children}</div>
    </div>
  );
}

/**
 * ProductShowcase — scroll-driven tour. On wide screens the text steps scroll
 * past a sticky frame whose preview swaps to match the step in view; on small
 * screens each step shows its own preview inline.
 */
export default function ProductShowcase() {
  // Only one layout is mounted, so preview animations/timers never run twice.
  const isWide = useMediaQuery('(min-width: 961px)');
  const activeId = useActiveSection(IDS) ?? IDS[0];
  const active = SHOWCASE.find((s) => s.id === activeId) ?? SHOWCASE[0];
  const ActivePreview = PREVIEWS[active.preview];

  return (
    <Section aria-labelledby="hp-showcase-title" className="hp-showcase">
      <Container>
        <SectionHeader
          id="hp-showcase-title"
          align="center"
          eyebrow="The platform"
          title={
            <>
              Four tools. <span className="ds-gradient-text">One learning flow.</span>
            </>
          }
          description="Scroll through what you can do on Chaitanya Tech World."
        />

        <div className="hp-showcase__grid">
          <div className="hp-showcase__steps">
            {SHOWCASE.map((step, i) => {
              const Preview = PREVIEWS[step.preview];
              return (
                <article key={step.id} id={step.id} className={clsx('hp-step', step.id === activeId && 'is-active')}>
                  <span className="hp-step__index">0{i + 1}</span>
                  <p className="hp-step__kicker">{step.kicker}</p>
                  <h3 className="hp-step__title">{step.title}</h3>
                  <p className="hp-step__text">{step.text}</p>
                  <ul className="hp-step__points">
                    {step.points.map((p) => (
                      <li key={p}>
                        <Check size={15} aria-hidden="true" /> {p}
                      </li>
                    ))}
                  </ul>
                  <Button to={step.cta.to} variant="secondary" iconEnd={<ArrowRight size={15} />}>
                    {step.cta.label}
                  </Button>

                  {!isWide && (
                    <div className="hp-step__inline">
                      <Frame label={step.preview}>
                        <Preview />
                      </Frame>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {isWide && (
            <div className="hp-showcase__stage" aria-hidden="true">
              <div className="hp-showcase__sticky">
                <div className="hp-showcase__progress">
                  {SHOWCASE.map((s) => (
                    <span key={s.id} className={s.id === activeId ? 'is-active' : undefined} />
                  ))}
                </div>
                <Frame label={active.preview}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -18, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ActivePreview />
                    </motion.div>
                  </AnimatePresence>
                </Frame>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
