import { ArrowUp } from 'lucide-react';
import SocialIcon from '@/components/site/SocialIcon';
import DeveloperSignature from '@/components/site/DeveloperSignature';
import { PROFILE } from '../data/portfolioContent';

export default function PortfolioFooter() {
  return (
    <footer className="pf-footer">
      <div className="pf-container">
        <div className="pf-footer__top">
          <DeveloperSignature className="pf-footer__signature" />
          <div className="pf-footer__links">
            {PROFILE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="pf-icon-btn"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={s.icon} size={17} />
              </a>
            ))}
            <a href={`mailto:${PROFILE.email}`} className="pf-icon-btn" aria-label="Email">
              <SocialIcon name="mail" size={17} />
            </a>
            <a href="#top" className="pf-icon-btn pf-icon-btn--accent" aria-label="Back to top">
              <ArrowUp size={17} />
            </a>
          </div>
        </div>
        <div className="pf-footer__bottom">
          <p>
            © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
          </p>
          <p>Java · Spring Boot · Microservices</p>
        </div>
      </div>
    </footer>
  );
}
