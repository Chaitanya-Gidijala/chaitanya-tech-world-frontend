import { Container, Marquee, useDocumentMeta } from '@/design-system';
import HomeHero from './components/HomeHero';
import TodayPanel from '@/features/engagement/components/TodayPanel';
import ProductShowcase from './components/ProductShowcase';
import FeaturedPaths from './components/FeaturedPaths';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import Faq from './components/Faq';
import { TECH_STACK } from './data/homeContent';
import './home.css';

/**
 * HomePage — the landing page at "/".
 * Hero → tech marquee → scroll-driven product showcase → featured paths →
 * benefits → how it works → FAQ (footer CTA comes from SiteFooter).
 * All copy lives in ./data/homeContent.js.
 */
export default function HomePage() {
  useDocumentMeta({
    title: 'Chaitanya Tech World — Learn. Visualise. Build.',
    description:
      'Free developer roadmaps, animated algorithm walkthroughs, Claude certification study guides and a curated AI image prompt library.',
  });

  return (
    <>
      <HomeHero />
      <TodayPanel />

      <section className="hp-marquee" aria-label="Technologies covered">
        <Container>
          <p className="hp-marquee__label">Covering the stack modern teams actually use</p>
        </Container>
        <Marquee items={TECH_STACK} speed={45} renderItem={(t) => <span className="hp-marquee__chip">{t}</span>} />
        <Marquee
          items={[...TECH_STACK].reverse()}
          speed={55}
          reverse
          renderItem={(t) => <span className="hp-marquee__chip">{t}</span>}
        />
      </section>

      <ProductShowcase />
      <FeaturedPaths />
      <Benefits />
      <HowItWorks />
      <Faq />
    </>
  );
}
