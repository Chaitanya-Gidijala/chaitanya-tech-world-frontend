import { useRef } from 'react';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { EXPERIENCE } from '../data/portfolioContent';
import { FadeIn, SectionHeading } from './ui';

export default function ExperienceSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="pf-section" aria-labelledby="pf-exp-title">
      <div className="pf-container">
        <SectionHeading
          id="pf-exp-title"
          number="02"
          kicker="Experience"
          title="Where I’ve"
          accent="shipped."
          description="Building backend services for enterprise workflows."
        />

        <div className="pf-timeline" ref={ref}>
          <span className="pf-timeline__track" aria-hidden="true">
            <motion.span className="pf-timeline__fill" style={{ scaleY: lineScale }} />
          </span>

          <ol>
            {EXPERIENCE.map((job) => (
              <li key={`${job.company}-${job.period}`} className="pf-job">
                <span className="pf-job__node" aria-hidden="true">
                  <Briefcase size={16} />
                </span>
                <FadeIn className="pf-job__card">
                  <header className="pf-job__head">
                    <div>
                      <h3 className="pf-job__role">{job.role}</h3>
                      <p className="pf-job__company">{job.company}</p>
                    </div>
                    <span className="pf-job__period">{job.period}</span>
                  </header>
                  <p className="pf-job__client">{job.client}</p>
                  <ul className="pf-job__bullets">
                    {job.bullets.map((b, i) => (
                      <FadeIn as="li" key={b} delay={0.1 + i * 0.06} y={12}>
                        {b}
                      </FadeIn>
                    ))}
                  </ul>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
