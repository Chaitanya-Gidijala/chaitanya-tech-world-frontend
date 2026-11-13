import { Briefcase, Eye, Layers, Smartphone, Target, Unlock } from 'lucide-react';
import { Container, Reveal, Section, SectionHeader } from '@/design-system';
import { BENEFITS } from '../data/homeContent';

const ICONS = { layers: Layers, eye: Eye, target: Target, briefcase: Briefcase, unlock: Unlock, smartphone: Smartphone };

export default function Benefits() {
  return (
    <Section aria-labelledby="hp-benefits-title" className="hp-benefits">
      <Container>
        <SectionHeader
          id="hp-benefits-title"
          align="center"
          eyebrow="Why learners stay"
          title={
            <>
              Designed for <span className="ds-gradient-text">real progress</span>
            </>
          }
        />
        <ul className="hp-benefits__grid">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon];
            return (
              <Reveal as="li" key={b.title} delay={(i % 3) * 0.08} className="hp-benefit ds-spotlight">
                <span className="hp-benefit__icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
