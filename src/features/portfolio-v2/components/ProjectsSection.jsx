import { ArrowUpRight, Lock } from 'lucide-react';
import { PROJECTS } from '../data/portfolioContent';
import { FadeIn, SectionHeading, TiltCard } from './ui';

export default function ProjectsSection() {
  return (
    <section id="projects" className="pf-section" aria-labelledby="pf-projects-title">
      <div className="pf-container">
        <SectionHeading
          id="pf-projects-title"
          number="03"
          kicker="Projects"
          title="Independent"
          accent="work."
          description="Tools built to explore learning, automation and developer experience."
        />

        <div className="pf-projects">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.1} className="pf-project-wrap">
              <TiltCard className="pf-project">
                <span className="pf-project__glare" aria-hidden="true" />
                <div className="pf-project__top">
                  <span className="pf-project__index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pf-project__category">{project.category}</span>
                </div>
                <h3 className="pf-project__title">{project.title}</h3>
                <p className="pf-project__desc">{project.description}</p>
                <ul className="pf-chips pf-chips--sm">
                  {project.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="pf-project__foot">
                  {project.link ? (
                    <a href={project.link.href} className="pf-link">
                      {project.link.label} <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="pf-project__note">
                      <Lock size={14} aria-hidden="true" /> {project.note}
                    </span>
                  )}
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
