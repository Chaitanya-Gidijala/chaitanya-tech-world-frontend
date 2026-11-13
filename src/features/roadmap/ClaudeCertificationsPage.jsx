import { ArrowRight, Check } from 'lucide-react';
import { Badge, Button, Callout, Card, Container, Section, TagList, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import ROUTES from '@/constants/routes';
import { CLAUDE_CERTS, DIFFICULTY_TONE } from './data/roadmapCatalog';
import './roadmap.css';

const GUIDE_PROMISES = ['Official Anthropic docs', 'Every exam domain covered', 'Curated, not bloated', 'Free forever'];

function CertPath() {
  return (
    <ol className="rm-steps rm-steps--vertical" aria-label="Certification path">
      {CLAUDE_CERTS.map((cert, i) => (
        <li key={cert.id} className="rm-steps__item">
          <span className="rm-steps__num">{i + 1}</span>
          <a href={`#${cert.id}`} className="rm-steps__link">
            <span>{cert.level}</span>
            <span className="rm-steps__code">{cert.code}</span>
          </a>
          {cert.status !== 'live' && <Badge>Soon</Badge>}
        </li>
      ))}
    </ol>
  );
}

function CertCard({ cert, index }) {
  const isLive = cert.status === 'live';
  const stats = [
    { label: 'Domains', value: cert.stats.domains },
    { label: 'Objectives', value: cert.stats.objectives },
    { label: 'Resources', value: cert.stats.resources },
    { label: 'Study time', value: `~${cert.stats.hours}h` },
  ];

  return (
    <Card as="article" id={cert.id} padding="lg" className={isLive ? 'rm-cert' : 'rm-cert is-disabled'}>
      <div className="rm-card__top">
        <span className="rm-card__index">
          Level {index + 1} · {cert.code}
        </span>
        <Badge tone={DIFFICULTY_TONE[cert.difficulty]}>{cert.difficulty}</Badge>
      </div>

      <div>
        <h2 className="rm-cert__title">{cert.title}</h2>
        <p className="rm-cert__subtitle">{cert.subtitle}</p>
      </div>

      <p className="rm-cert__desc">{cert.description}</p>

      <dl className="rm-card__stats">
        {stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      <TagList items={cert.tags} />

      <div className="rm-cert__foot">
        {isLive ? (
          <Button to={ROUTES.CERT_DETAIL(cert.id)} iconEnd={<ArrowRight size={15} />}>
            Open study guide
          </Button>
        ) : (
          <Button disabled variant="secondary">
            Coming soon
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function ClaudeCertificationsPage() {
  useDocumentMeta({
    title: 'Claude AI Certifications | Chaitanya Tech World',
    description: 'Study guides for the Anthropic Claude certifications — from Foundations to Expert.',
  });

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Roadmaps', to: ROUTES.ROADMAPS }, { label: 'Claude certifications' }]}
        eyebrow="Anthropic certifications"
        title="Claude certification paths"
        description="Four certifications from Associate foundations to Expert-level research applications. Each study guide links directly to official Anthropic documentation."
        aside={<CertPath />}
      />

      <Section>
        <Container>
          <div className="rm-cert-grid">
            {CLAUDE_CERTS.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>

          <Callout tone="neutral" className="rm-note" title="Are these guides enough to pass?">
            <p>
              Every guide is built from the official Anthropic exam blueprint — the same domains, objectives and
              documentation Anthropic publishes. To maximise your score, work through every resource in each domain,
              practise on the Anthropic platform and use Claude hands-on daily.
            </p>
            <ul className="rm-checks">
              {GUIDE_PROMISES.map((p) => (
                <li key={p}>
                  <Check size={14} aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
          </Callout>
        </Container>
      </Section>
    </>
  );
}
