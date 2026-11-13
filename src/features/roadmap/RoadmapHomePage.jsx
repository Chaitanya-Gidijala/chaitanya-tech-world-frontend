import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { Badge, Button, Container, Section, SectionHeader, TagList, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import ROUTES from '@/constants/routes';
import { CERT_TRACKS, COURSE_ROADMAPS } from './data/roadmapCatalog';
import './roadmap.css';

const HERO_STATS = [
  { label: 'Learning paths', value: COURSE_ROADMAPS.length + CERT_TRACKS.length },
  { label: 'Topics', value: '350+' },
  { label: 'AI certifications', value: 4 },
  { label: 'Cost', value: 'Free' },
];

function RoadmapCard({ roadmap, index }) {
  const isLive = roadmap.status === 'live';
  const to = roadmap.href ?? ROUTES.ROADMAP_DETAIL(roadmap.id);
  const Wrapper = isLive ? Link : 'div';

  return (
    <li>
      <Wrapper
        {...(isLive ? { to } : { 'aria-disabled': true })}
        className={clsx('ds-card ds-card--pad-md rm-card', isLive ? 'ds-card--interactive' : 'is-disabled')}
      >
        <div className="rm-card__top">
          <span className="rm-card__index">{String(index + 1).padStart(2, '0')}</span>
          {isLive ? (
            <Badge tone="accent" dot>
              Live
            </Badge>
          ) : (
            <Badge>Coming soon</Badge>
          )}
        </div>

        <h3 className="rm-card__title">{roadmap.title}</h3>
        <p className="rm-card__path">{roadmap.path.join(' → ')}</p>

        <dl className="rm-card__stats">
          {roadmap.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        <TagList items={roadmap.tags} />

        {isLive && (
          <span className="rm-card__cta">
            View roadmap <ArrowRight size={15} aria-hidden="true" />
          </span>
        )}
      </Wrapper>
    </li>
  );
}

function CertTrackCard({ track }) {
  return (
    <Link to={track.href} className="ds-card ds-card--pad-lg ds-card--interactive rm-track">
      <div className="rm-track__copy">
        <p className="ds-eyebrow">{track.provider}</p>
        <h3 className="rm-track__title">{track.title}</h3>
        <p className="rm-track__desc">{track.description}</p>
        <span className="rm-card__cta">
          View certifications <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
      <ol className="rm-steps" aria-label="Certification levels">
        {track.levels.map((level, i) => (
          <li key={level} className="rm-steps__item">
            <span className="rm-steps__num">{i + 1}</span>
            <span>{level}</span>
          </li>
        ))}
      </ol>
    </Link>
  );
}

export default function RoadmapHomePage() {
  useDocumentMeta({
    title: 'Developer Roadmaps & AI Certifications | Chaitanya Tech World',
    description:
      'Free structured roadmaps for Java, Frontend, Full Stack and DevOps — plus Claude AI certification study guides.',
  });

  return (
    <>
      <PageHero
        eyebrow="Learning paths · 2026"
        title="Structured roadmaps for working developers"
        description="Beginner-to-advanced learning paths built from real industry experience, plus study guides for official AI certifications."
        actions={
          <>
            <Button href="#courses" iconEnd={<ArrowRight size={16} />}>
              Browse roadmaps
            </Button>
            <Button to={ROUTES.CLAUDE_CERTS} variant="secondary">
              Claude certifications
            </Button>
          </>
        }
        stats={HERO_STATS}
      />

      <Section id="courses" aria-labelledby="rm-courses-title">
        <Container>
          <SectionHeader
            id="rm-courses-title"
            eyebrow="Development paths"
            title="Course roadmaps"
            description="Step-by-step paths from first principles to job-ready."
          />
          <ul className="rm-card-grid">
            {COURSE_ROADMAPS.map((rm, i) => (
              <RoadmapCard key={rm.id} roadmap={rm} index={i} />
            ))}
          </ul>
          <p className="rm-footnote">Python, Node.js and Android paths are in progress.</p>
        </Container>
      </Section>

      <Section bordered aria-labelledby="rm-certs-title">
        <Container>
          <SectionHeader
            id="rm-certs-title"
            eyebrow="AI certifications"
            title="Certification prep"
            description="Curated study guides mapped to official exam blueprints."
          />
          {CERT_TRACKS.map((track) => (
            <CertTrackCard key={track.id} track={track} />
          ))}
        </Container>
      </Section>
    </>
  );
}
