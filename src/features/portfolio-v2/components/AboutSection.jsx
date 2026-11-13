import { RichText } from '@/design-system';
import { ABOUT, SKILL_GROUPS } from '../data/portfolioContent';
import { ContentIcon } from './icons';
import { FadeIn, SectionHeading } from './ui';

const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.items);

function SkillMarquee() {
  const row = (hidden) => (
    <ul className="pf-marquee__row" aria-hidden={hidden || undefined}>
      {ALL_SKILLS.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
  return (
    <div className="pf-marquee">
      <div className="pf-marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="pf-section" aria-labelledby="pf-about-title">
      <div className="pf-container">
        <div className="pf-about">
          <SectionHeading id="pf-about-title" number="01" kicker="About" title="Reliable services," accent="measurable outcomes." />

          <FadeIn className="pf-about__text" delay={0.1}>
            {ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>
                <RichText text={p} />
              </p>
            ))}
          </FadeIn>
        </div>

        <ul className="pf-highlights">
          {ABOUT.highlights.map((h, i) => (
            <FadeIn as="li" key={h.text} delay={i * 0.08} className="pf-highlight">
              <span className="pf-highlight__icon">
                <ContentIcon name={h.icon} size={20} />
              </span>
              <p>{h.text}</p>
            </FadeIn>
          ))}
        </ul>
      </div>

      <SkillMarquee />

      <div className="pf-container">
        <div className="pf-skills">
          {SKILL_GROUPS.map((group, i) => (
            <FadeIn key={group.title} delay={i * 0.1} className="pf-skill-card">
              <div className="pf-skill-card__head">
                <span className="pf-highlight__icon">
                  <ContentIcon name={group.icon} size={18} />
                </span>
                <h3>{group.title}</h3>
              </div>
              <ul className="pf-chips">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
