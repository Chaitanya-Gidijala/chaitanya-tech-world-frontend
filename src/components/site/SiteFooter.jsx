import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, IconButton, Reveal } from '@/design-system';
import { FOOTER_NAV, SOCIAL_LINKS } from '@/config/navigation';
import ROUTES from '@/constants/routes';
import BrandMark from './BrandMark';
import DeveloperSignature from './DeveloperSignature';
import SocialIcon from './SocialIcon';
import './site.css';

/** SiteFooter — CTA band, grouped links, socials and a compact signature bar. */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="ds-container">
        <Reveal className="site-footer__cta ds-spotlight">
          <div>
            <h2>Start learning something powerful today.</h2>
            <p>Roadmaps, certification guides, algorithm visualisations and prompts — all free.</p>
          </div>
          <div className="site-footer__cta-actions">
            <Button to={ROUTES.ROADMAPS} size="lg" iconEnd={<ArrowRight size={16} />}>
              Explore roadmaps
            </Button>
            <Button to={ROUTES.CONTACT} size="lg" variant="secondary">
              Get in touch
            </Button>
          </div>
        </Reveal>

        <div className="site-footer__top">
          <div className="site-footer__intro">
            <BrandMark />
            <p>
              A free learning platform for developers — built to make complex topics clear, visual and practical.
            </p>
            <div className="site-footer__social">
              {SOCIAL_LINKS.map((s) => (
                <IconButton
                  key={s.label}
                  href={s.href}
                  label={s.label}
                  variant="outline"
                  size="sm"
                  {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <SocialIcon name={s.icon} size={15} />
                </IconButton>
              ))}
            </div>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.title} className="site-footer__group" aria-label={group.title}>
              <p className="site-footer__heading">{group.title}</p>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="site-footer__bottom">
          <p>© {year} Chaitanya Tech World. All rights reserved.</p>
          <DeveloperSignature variant="inline" />
        </div>
      </div>
    </footer>
  );
}
