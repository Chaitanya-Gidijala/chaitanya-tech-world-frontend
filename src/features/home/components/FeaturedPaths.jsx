import { Link } from 'react-router-dom';
import { ArrowUpRight, Award, Clock, Layers } from 'lucide-react';
import { Badge, Container, Reveal, Section, SectionHeader, TagList } from '@/design-system';
import ROUTES from '@/constants/routes';
import { LIVE_CERTS, LIVE_ROADMAPS } from '../data/homeContent';

function PathCard({ to, kind, title, meta, tags, icon, delay }) {
  return (
    <Reveal delay={delay} className="hp-path-wrap">
      <Link to={to} className="hp-path ds-card ds-card--interactive">
        <div className="hp-path__top">
          <span className="hp-path__icon">{icon}</span>
          <Badge tone="accent" dot>
            {kind}
          </Badge>
        </div>
        <h3 className="hp-path__title">{title}</h3>
        <ul className="hp-path__meta">
          {meta.map((m) => (
            <li key={m.label}>
              {m.icon} {m.label}
            </li>
          ))}
        </ul>
        <TagList items={tags} />
        <span className="hp-path__cta">
          Start learning <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </Link>
    </Reveal>
  );
}

export default function FeaturedPaths() {
  const roadmapCards = LIVE_ROADMAPS.map((rm) => ({
    to: ROUTES.ROADMAP_DETAIL(rm.id),
    kind: 'Roadmap',
    title: rm.title,
    icon: <Layers size={18} />,
    tags: rm.tags,
    meta: [
      { label: `${rm.stats[0].value} phases`, icon: <Layers size={13} aria-hidden="true" /> },
      { label: `${rm.stats[2].value} weeks`, icon: <Clock size={13} aria-hidden="true" /> },
    ],
  }));
  const certCards = LIVE_CERTS.map((c) => ({
    to: ROUTES.CERT_DETAIL(c.id),
    kind: 'Certification',
    title: `${c.title} — ${c.subtitle}`,
    icon: <Award size={18} />,
    tags: c.tags.slice(0, 3),
    meta: [
      { label: `${c.stats.domains} domains`, icon: <Layers size={13} aria-hidden="true" /> },
      { label: `~${c.stats.hours}h study`, icon: <Clock size={13} aria-hidden="true" /> },
    ],
  }));
  const cards = [...roadmapCards, ...certCards];

  return (
    <Section aria-labelledby="hp-paths-title">
      <Container>
        <SectionHeader
          id="hp-paths-title"
          eyebrow="Start here"
          title={
            <>
              Featured <span className="ds-gradient-text">learning paths</span>
            </>
          }
          description="Live roadmaps and certification guides you can start right now."
          actions={
            <Link to={ROUTES.ROADMAPS} className="hp-link">
              All paths <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <div className="hp-paths">
          {cards.map((c, i) => (
            <PathCard key={c.to} {...c} delay={i * 0.08} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
