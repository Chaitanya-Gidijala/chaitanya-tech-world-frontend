// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { motion } from 'framer-motion';
import { Award, Eye, Map as MapIcon } from 'lucide-react';
import { Container, Reveal, Section, SectionHeader } from '@/design-system';
import { STEPS } from '../data/homeContent';

const ICONS = { map: MapIcon, eye: Eye, award: Award };

export default function HowItWorks() {
  return (
    <Section aria-labelledby="home-how-title">
      <Container>
        <SectionHeader
          id="home-how-title"
          align="center"
          eyebrow="How it works"
          title="From curious to certified in three steps"
        />

        <div className="home-steps">
          <motion.span
            className="home-steps__line"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <ol>
            {STEPS.map((step, i) => {
              const Icon = ICONS[step.icon];
              return (
                <Reveal as="li" key={step.title} delay={0.15 + i * 0.15} className="home-step ds-spotlight">
                  <span className="home-step__icon">
                    <Icon size={22} aria-hidden="true" />
                    <span className="home-step__num">{i + 1}</span>
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
