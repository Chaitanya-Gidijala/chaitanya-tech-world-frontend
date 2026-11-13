import { Award, GraduationCap } from 'lucide-react';
import { CERTIFICATIONS, EDUCATION } from '../data/portfolioContent';
import { FadeIn, SectionHeading } from './ui';

export default function CredentialsSection() {
  return (
    <section id="credentials" className="pf-section" aria-labelledby="pf-cred-title">
      <div className="pf-container">
        <SectionHeading
          id="pf-cred-title"
          number="04"
          kicker="Credentials"
          title="Education &"
          accent="certifications."
          description="Academic foundation plus certifications in Java, AI-assisted development and the Claude ecosystem."
        />

        <div className="pf-credentials">
          <div className="pf-edu">
            <h3 className="pf-subheading">
              <GraduationCap size={18} aria-hidden="true" /> Education
            </h3>
            {EDUCATION.map((e, i) => (
              <FadeIn key={e.degree} delay={i * 0.1} className="pf-edu__item">
                <p className="pf-edu__degree">{e.degree}</p>
                <p className="pf-edu__school">{e.institution}</p>
                <span className="pf-edu__score">{e.detail}</span>
              </FadeIn>
            ))}
          </div>

          <div>
            <h3 className="pf-subheading">
              <Award size={18} aria-hidden="true" /> Certifications
            </h3>
            <ul className="pf-certs">
              {CERTIFICATIONS.map((c, i) => (
                <FadeIn as="li" key={c.name} delay={i * 0.06} className="pf-cert">
                  <span className="pf-cert__year">{c.year}</span>
                  <p className="pf-cert__name">{c.name}</p>
                  {c.issuer && <p className="pf-cert__issuer">{c.issuer}</p>}
                </FadeIn>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
