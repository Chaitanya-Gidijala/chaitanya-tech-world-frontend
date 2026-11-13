import { Link } from 'react-router-dom';
import { Container, Disclosure, Reveal, Section, SectionHeader } from '@/design-system';
import ROUTES from '@/constants/routes';
import { FAQ } from '../data/homeContent';

export default function Faq() {
  return (
    <Section aria-labelledby="hp-faq-title">
      <Container className="hp-faq">
        <div className="hp-faq__intro">
          <SectionHeader
            id="hp-faq-title"
            eyebrow="FAQ"
            title="Questions, answered"
            description={
              <>
                Something else on your mind? <Link to={ROUTES.CONTACT}>Get in touch</Link>.
              </>
            }
          />
        </div>
        <div className="hp-faq__list">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.06}>
              <Disclosure headingLevel={3} defaultOpen={i === 0} summary={<span className="hp-faq__q">{item.q}</span>}>
                <p className="hp-faq__a">{item.a}</p>
              </Disclosure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
